import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Plugins} from '/imports/api/plugins';
import {ChartTemplates} from '/imports/api/charttemplates';

export const pluginSideNavCtrl = ['$scope', '$reactive', '$state', '$timeout', 'readState',
function ($scope, $reactive, $state, $timeout, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    plugins: () => Plugins.find().fetch().sort((a, b) => a.position - b.position),
    plugin: () => Plugins.findOne({_id: self.getReactively('user.selectedIds.pluginId')}),
    chartTemplates: () => ChartTemplates.find({pluginId: self.getReactively('user.selectedIds.pluginId')}).fetch(),
    deletablePlugin: () => (self.getReactively('plugin')) && (! self.getReactively('user.readOnly')) && (self.getReactively('chartTemplates.length') === 0)
    // and other stuff needs to go here like dependency checks, etc.
  });

  this.createPlugin = () => {
    Meteor.call('plugin.create', {
      userId: 'guest',
      name: 'Plugin ' + self.plugins.length,
      position: self.plugins.length
    }, (err, res) => {
      if (err) alert(err);
      else {
        self.switchPlugin(res);
      }
    });
  }

  this.switchPlugin = (selectedId) => {
    self.user.selectedIds.pluginId = selectedId;
    Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);}); //update user
    $state.reload($state.$current.name);
  }

  // update plugin in database
  this.updateDatabase = (_plugin) => {
    Meteor.call('plugin.update', _plugin._id, _plugin, (err, res) => {
      if (err) alert(err);
    });
  };

  this.updatePlugin = (_plugin) => {
    self.updateDatabase(_plugin);
  }

  this.updatePlugins = () => {
    self.plugins.forEach((_plugin, index) => {
      _plugin.position = index;
      self.updatePlugin(_plugin);
    });
  }

  this.sortOptions = {
    items: '.sortable-item',
    cancel: '',
    stop: (event, ui) => {
      self.updatePlugins();
    }
  };

  this.setEditMode = (_plugin) => {
    $( ".sortable-list" ).sortable("disable");
    _plugin.editable = true;
  }

  this.unsetEditMode = (_plugin) => {
    $( ".sortable-list" ).sortable( "enable");
    _plugin.editable = false;
    if ($scope.sideNavForm.$valid) self.updatePlugin(_plugin)
    else $state.reload($state.$current.name);
  }

  self.showAreYouSure = false; // no we do not want to delete this plugin... and we don't want to see deletion option...
  this.brieflyShowAreYouSure = () => {
    self.showAreYouSure = true;
    self.briefTimer = $timeout(() => {
      self.showAreYouSure = false;
    }, 3000); // 3 seconds
  };

  this.deletePlugin = () => {
    Meteor.call('plugin.delete', self.plugin._id, (err, res) => {
      if (err) alert(err);
      else {
        if (self.plugins.length > 0)
        self.user.selectedIds.pluginId = _.find(self.plugins, x => (x._id !== self.user.selectedIds.pluginId))._id;
        else delete self.user.selectedIds['pluginId'];
        Meteor.call('user.update', self.user, (err, res) => {if (err) alert(err);});
        $timeout.cancel(self.briefTimer);
        $state.reload($state.$current.name);
      }
    });
  }
}];
