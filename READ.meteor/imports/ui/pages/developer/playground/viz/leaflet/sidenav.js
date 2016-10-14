import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Playground} from '/imports/api/playground';

export const leafletSideNavCtrl = ['$scope', '$reactive', '$state', '$timeout', 'readState',
function ($scope, $reactive, $state, $timeout, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Playground.find({pluginType: 'leaflet'}).fetch(),
    item: () => Playground.findOne({_id: self.getReactively('user.selectedIds.leafletId')})
  });
  this.dataSchemas = Playground.find({pluginType: 'Data Schema'}).fetch();

  this.itemsControl = {
    itemType: "Leaflet Template",
    clonable: true,
    newItemName: undefined,
    selectedId: self.user.selectedIds.leafletId,
    selectedItem: self.item,
    creatable: () => (self.dataSchemas.length > 0),
    whyNotCreatable: "Leaflet template creation disabled since no data schemas are available",
    switchItem: (selectedId) => {
      self.user.selectedIds.leafletId = selectedId;
      Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
      $state.reload($state.$current.name);
    },
    createItem: () => {
      Meteor.call('playground.create', {
        userId: 'guest',
        pluginType: 'leaflet',
        name: self.itemsControl.itemType + ' ' + self.items.length,
        readOnly: false,
        inputSchemaId: self.dataSchemas[0]._id,
        testData: "{\n\tcenter: {\n\t\tlat: 51.505,\n\t\tlng: -0.09,\n\t\t\n\t\tzoom: 4\n\t}\n}",
        usageInfo: ''
      }, (err, res) => {
        if (err) alert(err);
        else {
          self.itemsControl.newItemName = undefined;
          self.itemsControl.switchItem(res);
        }
      });
    },
    cloneItem: () => {
      let name = self.item.name + ' clone';
      if (name.length > 20) name = self.item.name.substring(0, 14) + ' clone';
      Meteor.call('playground.create', {
        userId: 'guest',
        pluginType: 'leaflet',
        name: name,
        readOnly: false,
        inputSchemaId: self.item.inputSchemaId,
        testData: self.item.testData,
        usageInfo: self.item.usageInfo
      }, (err, res) => {
        if (err) alert(err);
        else self.itemsControl.switchItem(res);
      });
    }
  };

  this.itemControls = {
    itemType: 'Leaflet Template',
    newItemName: undefined,
    readOnlyable: true,
    validItem: () => true,
    updateItem: () => {
      self.updateDatabase(self.item);
      $state.reload($state.$current.name);
    },
    renameItem: () => {
      self.item.name = self.itemControls.newItemName;
      self.itemControls.updateItem();
      $state.reload($state.$current.name);
    },
    deletable: () => {
      return (readState.dependencies.getDerived(self.user.selectedIds.leafletId).length === 0);
    },
    deleteItem: () => {
      Meteor.call('playground.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          if (self.items.length > 0)
            self.user.selectedIds.leafletId = _.find(self.items, x => (x._id !== self.user.selectedIds.leafletId))._id;
          else delete self.user.selectedIds['leafletId'];
          Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
          $timeout.cancel(self.briefTimer);
          $state.reload($state.$current.name);
        }
      });
    }
  };

  this.updateDatabase = (val) => {
    Meteor.call('playground.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

}];
