import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Dashboards} from '/imports/api/dashboards';

export const dashboardSideNavCtrl = ['$scope', '$state', 'readState', function ($scope, $state, readState) {
  let self = this;
  this.readState = readState;

  this.items = Dashboards.find({appId: self.readState.app._id}).fetch();

  this.itemsControl = {
    itemType: "Dashboard",
    clonable: false,
    newItemName: undefined,
    selectedId: readState.app.selectedDashboardId,
    creatable: () => false,
    switchItem: (selectedId) => {
      readState.app.selectedDashboardId = selectedId;
      readState.app.selectedDashboardName = Dashboards.findOne({_id: selectedId}).name;
      $state.reload($state.$current.name);
    }
  };

}];
