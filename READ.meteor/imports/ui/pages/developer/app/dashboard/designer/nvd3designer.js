import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import Rx from 'rx/dist/rx.all'

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const nvd3VizDesignCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory', 'readState',
'reactivePipeline',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory, readState, reactivePipelineService) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    template: () => Playground.findOne({_id: $scope.designerCtrl.visualization.templateId}),
    basicOptionsSchema: () => {
      self.basicOptionsSchemaObject = Playground.findOne({_id: self.template.basicOptionsSchemaId});
      return eval("(" + self.basicOptionsSchemaObject.jsonSchema + ")");
    }
  });

  this.validators = {
    basicOptions: true,
    advancedOptions: true
  };

  this.validItem = () => (self.validators.basicOptions && self.validators.advancedOptions);

  this.itemStream = new Rx.ReplaySubject(0);

  $scope.$watch(() => { // because of crummy ui-ace not working with ng-show
    console.log('nvd3 designer controller scope watch fired');
    if (self.dataForm) self.validators.basicOptions = self.dataForm.$valid;
    if (self.advancedOptionsForm) self.validators.advancedOptions = self.advancedOptionsForm.$valid;
    return {
      valid: self.validItem(),
      item: $scope.designerCtrl.visualization
    };
  }, (newVal) => {
    self.itemStream.onNext(newVal);
  }, true);

  //update database
  self.itemStream
  .skip(1)
  .filter(x => x.valid)
  .map(x => x.item)
  .doOnNext(x => {
    $scope.designerCtrl.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

  let reactivePipeline = reactivePipelineService.getInstance();
  let tds = reactivePipeline.addReactiveData(readState.pipeline.findReactiveData($scope.designerCtrl.visualization.dataSetId));

  this.inputSchemaObject = Playground.findOne({_id: self.template.inputSchemaId});
  let validatedDataSet = {
    _id: "validatedData",
    name: "Validated Data",
    dataSetType: "validated",
    jsonSchema: self.inputSchemaObject.jsonSchema,
    parentId: $scope.designerCtrl.visualization.dataSetId
  };
  let vds = reactivePipeline.addDataSet(validatedDataSet);

  let basicOptionsDataSet = {
    _id: "basicOptions",
    name: "Basic Options",
    dataSetType: "raw",
    rawData: $scope.designerCtrl.visualization.basicOptions
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

}];
