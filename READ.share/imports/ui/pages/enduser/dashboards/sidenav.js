import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Dashboards} from '/imports/api/dashboards';

export const dashboardSideNavCtrl = ['$scope', '$state', 'readState', function ($scope, $state, readState) {
  let self = this;
  this.readState = readState;

  this.items = Dashboards.find({appId: self.readState.app._id}).fetch();
  this.item = Dashboards.findOne({_id: self.readState.app.selectedDashboardId});
  
  this.itemsControl = {
    itemType: "Dashboard",
    selectedId: readState.app.selectedDashboardId,
    switchItem: (selectedId) => {
      readState.app.selectedDashboardId = selectedId;
      readState.app.selectedDashboardName = Dashboards.findOne({_id: selectedId}).name;
      $state.reload($state.$current.name);
    }
  };

}];
