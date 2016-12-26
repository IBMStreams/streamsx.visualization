import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users';
import {PlaygroundDatasets} from '/imports/api/playgrounddatasets';
import {Plugins} from '/imports/api/plugins';
import {ChartTemplates} from '/imports/api/charttemplates';

export const playgroundMainContentCtrl = ['$scope', '$reactive', 'readState', '$state',
function($scope, $reactive, readState, $state) {
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

}];
