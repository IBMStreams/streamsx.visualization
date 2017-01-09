import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import Rx from 'rx/dist/rx.all';

import {Users} from '/imports/api/users';
import {Plugins} from '/imports/api/plugins';
import {ChartTemplates} from '/imports/api/charttemplates';
import {PlaygroundDatasets} from '/imports/api/playgrounddatasets';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const chartTemplateCtrl = ['$scope', '$reactive', 'readState', '$state', '$timeout',
function($scope, $reactive, readState, $state, $timeout) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  // let pluginIndex = Number($stateParams.pluginIndex);
  // let templateIndex = Number($stateParams.index);

  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;
  this.aceHTMLOptions = aceHTMLOptions;

  this.validators = {
    dataHandlers: true,
    options: true,
    css: true
  };

  this.helpers({
    user: () => Users.findOne({}),
    plugin: () => Plugins.findOne({_id: self.getReactively('user.selectedIds.pluginId')}),
    chartTemplate: () => ChartTemplates.findOne({_id: self.getReactively('plugin.selectedChartTemplateId')}),
    visualization: () => {
      console.log(self.plugin);
      console.log(self.chartTemplate);
      let viz = self.getReactively('chartTemplate', true);
      viz.inputs.forEach(input => input.reactiveData = readState.pipeline.findReactiveData(input.datasetId));
      return viz;
    },
    inputtable: () => (PlaygroundDatasets.find({}).fetch().length > 0),
    playgroundDatasets: () => PlaygroundDatasets.find({}).fetch().sort((a, b) => a.position - b.position)
  });

  self.updateTemplate = () => {
    self.injectChartTemplate(self.chartTemplate);
  }

  self.createInput = () => {
    let input = {
      name: "Input " + self.chartTemplate.inputs.length,
      optional: true,
      datasetId: PlaygroundDatasets.find({}).fetch()[0]._id,
      dataHandler: 'x => x'
    }
    self.chartTemplate.inputs.push(input);
    self.injectChartTemplate(self.chartTemplate);
  }

  this.showBriefly = undefined;
  this.brieflyShow = (text) => {
    this.showBriefly = text;
    // if (self.briefTimer) self.briefTimer();
    self.briefTimer = $timeout(() => {
      self.showBriefly = undefined;
    }, 3000); // 3 seconds
  }

  self.showAreYouSure = undefined; // no we do not want to delete this input... and we don't want to see deletion option...
  this.brieflyShowAreYouSure = (input) => {
    self.showAreYouSure = input;
    self.briefTimer = $timeout(() => {
      self.showAreYouSure = undefined;
    }, 3000); // 3 seconds
  };

  self.deleteInput = (input) => {
    self.chartTemplate.inputs = self.chartTemplate.inputs.filter(x => x !== input);
    self.injectChartTemplate(self.chartTemplate);
  }

  this.itemStream = new Rx.ReplaySubject(0);

  self.injectChartTemplate = (ct) => {
    if (self.dataHandlers) self.validators.dataHandlers = self.dataHandlers.$valid;
    if (self.options) self.validators.options = self.options.$valid;
    if (self.css) self.validators.css = self.css.$valid;
    self.itemStream.onNext({
      valid: self.validators.dataHandlers && self.validators.options && self.validators.css,
      item: ct
    });
    $timeout();
  };

  $scope.$watch('chartTemplateCtrl.chartTemplate', _.debounce((newVal) => {
    self.injectChartTemplate(newVal);
  }, 1000), true);

  this.updateDatabase = (val) => {
    Meteor.call('chartTemplate.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  //update database
  self.itemStream
  .skip(1)
  .filter(x => x.valid)
  .map(x => x.item)
  .doOnNext(x => {
    self.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

  // this.rds = readState.pipeline.findReactiveData(self.dataset._id);
  //
  // this.rds.stream.doOnNext(x => {
  //   self.lastDataObject = x;
  //   $timeout(); // this seems necessary for propagating changes to the view...
  // }).subscribe(new Rx.ReplaySubject(0));
}];
