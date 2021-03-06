import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Playground} from '/imports/api/playground';

export const schemaSideNavCtrl = ['$scope', '$reactive', '$state', '$timeout', 'readState',
function ($scope, $reactive, $state, $timeout, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Playground.find({pluginType: 'Data Schema'}).fetch(),
    item: () => Playground.findOne({_id: self.getReactively('user.selectedIds.dataSchemaId')})
  });

  this.itemsControl = {
    itemType: "Data Schema",
    clonable: ! self.user.readOnly,
    selectedId: self.user.selectedIds.dataSchemaId,
    selectedItem: self.item,
    creatable: () => ! self.user.readOnly,
    switchItem: (selectedId) => {
      self.user.selectedIds.dataSchemaId = selectedId;
      Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
      $state.reload($state.$current.name);
    },
    createItem: () => {
      Meteor.call('playground.create', {
        userId: 'guest',
        pluginType: 'Data Schema',
        name: self.itemsControl.itemType + ' ' + self.items.length,
        jsonSchema: '{}',
        testData: "42"
      }, (err, res) => {
        if (err) alert(err);
        else {
          self.itemsControl.switchItem(res);
        }
      });
    },
    cloneItem: () => {
      let name = self.item.name + ' clone';
      if (name.length > 20) name = self.item.name.substring(0, 14) + ' clone';
      Meteor.call('playground.create', {
        userId: 'guest',
        pluginType: 'Data Schema',
        name: name,
        jsonSchema: self.item.jsonSchema,
        testData: self.item.testData
      }, (err, res) => {
        if (err) alert(err);
        else self.itemsControl.switchItem(res);
      });
    }
  };

  this.itemControls = {
    itemType: 'Data Schema',
    validItem: () => true,
    updateItem: () => {
      self.updateDatabase(self.item);
      $state.reload($state.$current.name);
    },
    renameItem: (newName) => {
      self.item.name = newName;
      self.updateDatabase(self.item);
    },
    deletable: () => {
      return (readState.dependencies.getDerived(self.user.selectedIds.dataSchemaId).length === 0);
    },
    deleteItem: () => {
      Meteor.call('playground.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          if (self.items.length > 0)
          self.user.selectedIds.dataSchemaId = _.find(self.items, x => (x._id !== self.user.selectedIds.dataSchemaId))._id;
          else delete self.user.selectedIds['dataSchemaId'];
          Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
          $timeout.cancel(self.briefTimer);
          $state.reload($state.$current.name);
        }
      });
    }
  };

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('playground.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };


}];
