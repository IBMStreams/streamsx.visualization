import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';

export default sideNavCtrl = ['$scope', '$reactive', '$state', function ($scope, $reactive, $state) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Apps.find({}).fetch(),
    item: () => Apps.findOne({_id: self.user.selectedIds.appId})
  });

  this.itemsControl = {
    itemType: "App",
    clonable: false,
    newItemName: undefined,
    selectedId: self.user.selectedIds.appId,
    selectedItem: Apps.findOne({_id: self.user.selectedIds.appId}),
    creatable: () => true,
    switchItem: (selectedId) => {
      self.user.selectedIds.appId = selectedId;
      Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
      $state.reload($state.$current.name);
    },
    createItem: () => {
      Meteor.call('app.create', {
        userId: 'guest',
        name: self.itemsControl.newItemName,
        private: true,
        readOnly: false
      }, (err, res) => {
        if (err) alert(err);
        else {
          self.itemsControl.newItemName = undefined;
          self.itemsControl.switchItem(res);
        }
      });
    }
  };

  this.itemControls = {
    itemType: 'App',
    newItemName: undefined,
    readOnlyable: false,
    validItem: () => true,
    renameItem: () => {
      self.item.name = self.itemControls.newItemName;
      self.itemControls.updateItem();
      $state.reload($state.$current.name);
    },
    updateItem: () => {
      self.updateDatabase(self.item);
      $state.reload($state.$current.name);
    },
    deletable: () => self.item.private,
    deleteItem: () => {
      // start by deleting visualizations
      Visualizations.find({appId: self.item._id}).fetch().forEach(visualization => {
        Meteor.call('visualization.delete', visualization._id, (err, res) => {if (err) alert(err);});
      });
      // and dashboards
      Dashboards.find({appId: self.item._id}).fetch().forEach(dashboard => {
        Meteor.call('dashboard.delete', dashboard._id, (err, res) => {if (err) alert(err);});
      });
      // and datasets
      DataSets.find({appId: self.item._id}).fetch().forEach(dataSet => {
        Meteor.call('dataSet.delete', dataSet._id, (err, res) => {if (err) alert(err);});
      });
      // and datapanels
      DataPanels.find({appId: self.item._id}).fetch().forEach(dataPanel => {
        Meteor.call('dataPanel.delete', dataPanel._id, (err, res) => {if (err) alert(err);});
      });
      // and then delete app...
      Meteor.call('app.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          let newSelectedItem = _.find(self.items, x => (x._id !== self.user.selectedIds.appId));
          // we are updating user but avoiding update of items (or anything else here);
          if (newSelectedItem) self.user.selectedIds.appId = newSelectedItem._id;
          else delete self.user.selectedIds['appId'];
          Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
          $state.reload($state.$current.name);
        }
      });
    }
  };

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('app.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];