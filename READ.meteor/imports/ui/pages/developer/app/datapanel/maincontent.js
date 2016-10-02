import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';

export default mainContentCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory', 'readState',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dataPanel: () => DataPanels.findOne({_id: self.getReactively('app.selectedDataPanelId')}),
    dataSet: () => DataSets.findOne({_id: self.getReactively('dataPanel.selectedDataSetId')})
  });

}];
