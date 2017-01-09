import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Plugins} from '/imports/api/plugins';
import {ChartTemplates} from '/imports/api/charttemplates';

export const chartTemplateSideNavCtrl = ['$scope', '$reactive', '$state', '$timeout', 'readState',
function ($scope, $reactive, $state, $timeout, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    plugin: () => Plugins.findOne({_id: self.getReactively('user.selectedIds.pluginId')}),
    chartTemplates: () => ChartTemplates.find({pluginId: self.getReactively('plugin._id')}).fetch().sort((a, b) => a.position - b.position),
    chartTemplate: () => ChartTemplates.findOne({_id: self.getReactively('plugin.selectedChartTemplateId')}),
    clonableChartTemplate: () => (self.getReactively('chartTemplate')) && (! self.getReactively('user.readOnly')),
    deletableChartTemplate: () => ! self.user.readOnly // and other stuff needs to go here like dependency checks, etc.
  });

  this.createChartTemplate = (ct) => {
    let chartTemplate = ct ? ct : {
      userId: 'guest',
      pluginId: self.getReactively('plugin._id'),
      name: 'Chart Template ' + self.chartTemplates.length,
      initFunction: 'x => x',
      inputs: [],
      cleanupFunction: 'x => x',
      position: self.chartTemplates.length
    };

    Meteor.call('chartTemplate.create', chartTemplate, (err, res) => {
      if (err) alert(err);
      self.switchChartTemplate(res);
    });
  }

  this.cloneChartTemplate = () => {
    let chartTemplate = angular.merge({}, self.getReactively('chartTemplate'), {
        name: 'Cloned Template'
      }
    );
    delete chartTemplate["_id"];
    self.createChartTemplate(chartTemplate);
    self.updateChartTemplates();
  }

  this.switchChartTemplate = (selectedId) => {
    self.plugin.selectedChartTemplateId = selectedId;
    Meteor.call('plugin.update', self.plugin._id, self.plugin, (err, res) => {if (err) alert(err);}); //update plugin
    $state.transitionTo($state.current, {}, {
      reload: true, inherit: false, notify: true
    });
  }

  // update chart template in database
  this.updateDatabase = (_chartTemplate) => {
    Meteor.call('chartTemplate.update', _chartTemplate._id, _chartTemplate, (err, res) => {
      if (err) alert(err);
    });
  };

  this.updateChartTemplate = (_chartTemplate) => {
    self.updateDatabase(_chartTemplate);
  }

  this.updateChartTemplates = () => {
    self.chartTemplates.forEach((_chartTemplate, index) => {
      _chartTemplate.position = index;
      self.updateChartTemplate(_chartTemplate);
    });
  }

  this.sortOptions = {
    items: '.sortable-item',
    cancel: '',
    stop: (event, ui) => {
      self.updateChartTemplates();
    }
  };

  this.setEditMode = (_chartTemplate) => {
    $( ".sortable-list" ).sortable("disable");
    _chartTemplate.editable = true;
  }

  this.unsetEditMode = (_chartTemplate) => {
    $( ".sortable-list" ).sortable( "enable");
    _chartTemplate.editable = false;
    if ($scope.sideNavForm.$valid) self.updateChartTemplate(_chartTemplate)
    else $state.reload($state.$current.name);
  }

  self.showAreYouSure = false; // no we do not want to delete this chart template... and we don't want to see deletion option...
  this.brieflyShowAreYouSure = () => {
    self.showAreYouSure = true;
    self.briefTimer = $timeout(() => {
      self.showAreYouSure = false;
    }, 3000); // 3 seconds
  };

  this.deleteChartTemplate = () => {
    Meteor.call('chartTemplate.delete', self.chartTemplate._id, (err, res) => {
      if (err) alert(err);
      else {
        if (self.chartTemplates.length > 0)
        self.plugin.selectedChartTemplateId = _.find(self.chartTemplates, x => (x._id !== self.plugin.selectedChartTemplateId))._id;
        else delete self.plugin['selectedChartTemplateId'];
        Meteor.call('plugin.update', self.plugin._id, self.plugin, (err, res) => {if (err) alert(err);});
        $timeout.cancel(self.briefTimer);
        $state.reload($state.$current.name);
      }
    });
  }
}];
