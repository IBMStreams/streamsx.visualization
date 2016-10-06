import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const vizDesignCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory', 'readState',
'reactivePipeline',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory, readState, reactivePipelineService) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.user = Users.findOne({});
  this.app = Apps.findOne({_id: self.user.selectedIds.appId});
  this.dashboard = Dashboards.findOne({_id: self.app.selectedDashboardId});
  this.visualization = Visualizations.findOne({_id: self.dashboard.selectedVisualizationId});
  this.visualization.readOnly = this.app.readOnly;
  this.dataSets = DataSets.find({appId: self.user.selectedIds.appId}).fetch();
  this.templates = Playground.find({pluginType: 'NVD3'}).fetch();
  this.template = Playground.findOne({_id: self.visualization.templateId});

  this.helpers({
    basicOptionsSchema: () => {
      self.basicOptionsSchemaObject = Playground.findOne({_id: self.template.basicOptionsSchemaId});
      return eval("(" + self.basicOptionsSchemaObject.jsonSchema + ")");
    }
  });

  this.reactiveVisualization = this.visualization;
  this.ready = true;
  let visualizationQuery = Visualizations.find({_id: self.dashboard.selectedVisualizationId});
  let visualizationQueryHandle = visualizationQuery.observe({
    changed: (newVisualization, oldVisualization) => {
      this.ready = false;
      $timeout(() => {
        this.reactiveVisualization = newVisualization;
        this.ready = true;
      }, 0);
    }
  });

  this.nameExtended = false;
  this.dataSets.forEach(dataSet => {
    dataSet.dataPanelName = DataPanels.findOne({_id: dataSet.dataPanelId}).name;
  });
  this.nameExtended = true;

  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;
  this.aceHTMLOptions = aceHTMLOptions;

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('visualization.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  // update and reload
  this.updateAndReload = () => {
    self.template = Playground.findOne({_id: self.visualization.templateId});
    self.visualization.advancedOptions = self.template.advancedOptions;
    Meteor.call('visualization.update', self.visualization._id, self.visualization, (err, res) => {
      if (err) alert(err);
      $state.reload('read.developer.app.dashboard');
    });
  }

  this.visualizationControls = {
    itemType: 'Visualization',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => { // because of crummy ui-ace not working with ng-show; would rather use $valid
      return self.validators.basicOptions &&
      self.validators.advancedOptions;
    },
    renameItem: () => {
      self.visualization.name = self.visualizationControls.newItemName;
      self.updateDatabase(self.visualization);
      self.visualizationControls.newItemName = undefined;
      $state.reload('read.developer.app.dashboard');
    },
    deletable: () => self.app.private,
    deleteItem: () => {
      Meteor.call('visualization.delete', self.visualization._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedVisualization = _.find(self.visualizations, x => (x._id !== self.dashboard.selectedVisualizationId));
          // we are updating dashboard but avoiding update of anything else
          if (newSelectedVisualization) self.dashboard.selectedVisualizationId = newSelectedVisualization._id;
          else delete self.dashboard.selectedVisualizationId;
          Meteor.call('dashboard.update', self.dashboard._id, self.dashboard, (err, res) => {if (err) alert(err);});
          $state.reload('read.developer.app.dashboard');
        }
      });
    }
  };

  this.validators = {
    basicOptions: true,
    advancedOptions: true
  };

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch('vizDesignCtrl.visualization', _.debounce(function(item) {
    $scope.$apply(function() {
      if (self.dataForm) self.validators.basicOptions = self.dataForm.$valid;
      if (self.advancedOptionsForm) self.validators.advancedOptions = self.advancedOptionsForm.$valid;
      self.itemStream.onNext({
        valid: self.visualizationControls.validItem(),
        item: item
      });
    });
  }, 2), true); // the 2 milli second debounce is for validators and reactive computes to kick in.

  //update database
  self.itemStream
  .skip(1)
  .filter(x => x.valid)
  .map(x => x.item)
  .doOnNext(x => {
    self.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

  let reactivePipeline = reactivePipelineService.getInstance();
  let tds = reactivePipeline.addReactiveData(readState.pipeline.findReactiveData(self.visualization.dataSetId));

  this.inputSchemaObject = Playground.findOne({_id: self.template.inputSchemaId});
  let validatedDataSet = {
    _id: "validatedData",
    name: "Validated Data",
    dataSetType: "validated",
    jsonSchema: self.inputSchemaObject.jsonSchema,
    parentId: self.visualization.dataSetId
  };
  let vds = reactivePipeline.addDataSet(validatedDataSet);

  let basicOptionsDataSet = {
    _id: "basicOptions",
    name: "Basic Options",
    dataSetType: "raw",
    rawData: self.visualization.basicOptions
  }
  let bods = reactivePipeline.addDataSet(basicOptionsDataSet);

  let validatedBasicOptionsDataSet = {
    _id: "validatedBasicOptions",
    name: "Validated Basic Options",
    dataSetType: "validated",
    jsonSchema: self.basicOptionsSchemaObject.jsonSchema,
    parentId: "basicOptions"
  };
  let vbods = reactivePipeline.addDataSet(validatedBasicOptionsDataSet);

  let canonicalDataSet = {
    _id: 'canonicalData',
    name: "Canonical Data",
    dataSetType: "transformed",
    stateParams: {
      enabled: false
    },
    parents: ['validatedData', 'validatedBasicOptions'],
    transformFunction: self.template.canonicalTransform
  };
  let cds = reactivePipeline.addDataSet(canonicalDataSet);

  this.canonicalSchemaObject = Playground.findOne({_id: self.template.canonicalSchemaId});
  let validatedCanonicalDataSet = {
    _id: "validatedCanonicalData",
    name: "Validated Canonical Data",
    dataSetType: "validated",
    jsonSchema: self.canonicalSchemaObject.jsonSchema,
    parentId: "canonicalData"
  };
  let vcds = reactivePipeline.addDataSet(validatedCanonicalDataSet);
  vcds.stream.doOnNext(x => (self.canonicalDataObject = x)).subscribe(new Rx.ReplaySubject(0));

  //update basicOptions
  self.itemStream
  .filter(x => self.validators.basicOptions)
  .map(x => x.item.basicOptions)
  .distinctUntilChanged()
  .doOnNext(x => {
    basicOptionsDataSet.rawData = x;
    bods = reactivePipeline.changeDataSet(basicOptionsDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

  //update advancedOptions
  self.itemStream
  .filter(x => self.validators.advancedOptions)
  .map(x => x.item.advancedOptions)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    self.advancedOptions = eval("(" + x + ")");
  }).subscribe(new Rx.ReplaySubject(0));

  this.dimensions = {
    height: undefined,
    width: undefined
  };

}];
