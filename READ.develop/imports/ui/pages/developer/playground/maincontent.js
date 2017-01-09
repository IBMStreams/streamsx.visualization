import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users';
import {PlaygroundDatasets} from '/imports/api/playgrounddatasets';
import {Plugins} from '/imports/api/plugins';
import {ChartTemplates} from '/imports/api/charttemplates';

export const playgroundMainContentCtrl = ['$scope', '$reactive', 'readState', '$state', '$stateParams',
function($scope, $reactive, readState, $state, $stateParams) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  this.currentState = $state.$current.name.split(/\./).pop();

  this.helpers({
    user: () => Users.findOne({}),
    plugin: () => Plugins.findOne({_id: self.getReactively('user.selectedIds.pluginId')}),
    chartTemplate: () => ChartTemplates.findOne({_id: self.getReactively('plugin.selectedChartTemplateId')}),
    dataset: () => PlaygroundDatasets.findOne({_id: self.getReactively('user.selectedIds.playgroundDatasetId')})
  });

  let pluginIndex = $stateParams.plugin ? Number($stateParams.plugin) : -1;
  let templateIndex = $stateParams.template ? Number($stateParams.template) : -1;
  let datasetIndex = $stateParams.dataset ? Number($stateParams.dataset) : -1;

  let plugins = Plugins.find().fetch().sort((a, b) => a.position - b.position);
  if ((pluginIndex > -1) && (pluginIndex < plugins.length)) { // valid plugin index
    self.user.selectedIds.pluginId = plugins[pluginIndex]._id;
    Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
    let chartTemplates = ChartTemplates.find({pluginId: self.user.selectedIds.pluginId}).fetch().sort((a, b) => a.position - b.position);
    if ((templateIndex > -1) && (templateIndex < chartTemplates.length)) { // valid template index
      self.plugin.selectedChartTemplateId = chartTemplates[templateIndex]._id;
      Meteor.call('plugin.update', self.plugin._id, self.plugin, (err, res) => {if (err) alert(err);}); //update plugin
    }
  }
  let datasets = PlaygroundDatasets.find().fetch().sort((a, b) => a.position - b.position);
  if ((datasetIndex > -1) && (datasetIndex < datasets.length)) { // valid dataset index
    self.user.selectedIds.playgroundDatasetId = datasets[datasetIndex]._id;
    Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
  }

}];
