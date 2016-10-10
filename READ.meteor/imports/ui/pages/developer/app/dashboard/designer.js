import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import nvd3DesignerTemplateUrl from './nvd3designer.html';
import leafletDesignerTemplateUrl from './leafletdesigner.html';

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
  this.templates = Playground.find({
    $or: [
      {pluginType: 'NVD3'},
      {pluginType: 'leaflet'}
    ]
  }).fetch();

  this.reactiveVisualization = Visualizations.findOne({_id: self.dashboard.selectedVisualizationId});
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
    Meteor.call('visualization.update', self.visualization._id, self.visualization, (err, res) => {
      if (err) alert(err);
      $state.reload('read.developer.app.dashboard');
    });
  };

  this.updateChartTypeAndReload = () => {
    let newTemplate = Playground.findOne({_id: self.visualization.templateId});
    self.visualization.pluginType = newTemplate.pluginType;
    if (self.visualization.pluginType === 'NVD3') {
      self.visualization.basicOptions = newTemplate.basicOptions;
      self.visualization.advancedOptions = newTemplate.advancedOptions;
    }
    self.updateAndReload();
  };

  this.dimensions = {
    height: undefined,
    width: undefined
  };

}];
