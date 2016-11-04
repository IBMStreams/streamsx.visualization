import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Playground} from '/imports/api/playground';

export const nvd3SideNavCtrl = ['$scope', '$reactive', '$state', '$timeout', 'readState',
function ($scope, $reactive, $state, $timeout, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Playground.find({pluginType: 'NVD3'}).fetch(),
    item: () => Playground.findOne({_id: self.getReactively('user.selectedIds.nvd3Id')})
  });
  this.dataSchemas = Playground.find({pluginType: 'Data Schema'}).fetch();

  this.itemsControl = {
    itemType: "NVD3 Template",
    clonable: true,
    selectedId: self.user.selectedIds.nvd3Id,
    selectedItem: self.item,
    creatable: () => (self.dataSchemas.length > 0),
    whyNotCreatable: "NVD3 template creation disabled since no data schemas are available",
    switchItem: (selectedId) => {
      self.user.selectedIds.nvd3Id = selectedId;
      Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
      $state.reload($state.$current.name);
    },
    createItem: () => {
      Meteor.call('playground.create', {
        userId: 'guest',
        pluginType: 'NVD3',
        name: self.itemsControl.itemType + ' ' + self.items.length,
        inputSchemaId: self.dataSchemas[0]._id,
        testData: "42",
        basicOptionsSchemaId: self.dataSchemas[0]._id,
        basicOptions: '{}',
        canonicalSchemaId: self.dataSchemas[0]._id,
        canonicalTransform: 'x => x',
        advancedOptions: '{}',
        usageInfo: ''
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
        pluginType: 'NVD3',
        name: name,
        inputSchemaId: self.item.inputSchemaId,
        testData: self.item.testData,
        basicOptionsSchemaId: self.item.basicOptionsSchemaId,
        basicOptions: self.item.basicOptions,
        canonicalSchemaId: self.item.canonicalSchemaId,
        canonicalTransform: self.item.canonicalTransform,
        advancedOptions: self.item.advancedOptions,
        usageInfo: self.item.usageInfo
      }, (err, res) => {
        if (err) alert(err);
        else self.itemsControl.switchItem(res);
      });
    }
  };

  this.itemControls = {
    itemType: 'NVD3 Template',
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
      return (readState.dependencies.getDerived(self.user.selectedIds.nvd3Id).length === 0);
    },
    deleteItem: () => {
      Meteor.call('playground.delete', self.item._id, (err, res) => {
        if (err) alert(err);
        else {
          if (self.items.length > 0)
            self.user.selectedIds.nvd3Id = _.find(self.items, x => (x._id !== self.user.selectedIds.nvd3Id))._id;
          else delete self.user.selectedIds['nvd3Id'];
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
