import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {DataSets} from '/imports/api/datasets';

export const dashboardMainContentCtrl = ['$scope', '$reactive', function($scope, $reactive) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dashboard: () => self.getReactively('app') ? Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}) : undefined,
    dataSet: () => self.getReactively('dashboard') ? DataSets.findOne({_id: self.getReactively('dashboard.selectedDataSetId')}) : undefined,
  });

}];
