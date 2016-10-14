import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';

export const dashboardSideNavCtrl = ['$scope', '$reactive', '$state', 'readState', function ($scope, $reactive, $state, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dashboard: () => self.getReactively('app') ? Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}) : undefined
  });

}];
