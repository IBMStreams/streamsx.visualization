import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import Rx from 'rx/dist/rx.all';

import {Users} from '/imports/api/users';
import {PlaygroundDatasets} from '/imports/api/playgrounddatasets';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const playgroundDatasetCtrl = ['$scope', '$reactive', '$timeout', 'readState', '$state', 'datasetTypes', 'defaultDatasets',
function($scope, $reactive, $timeout, readState, $state, datasetTypes, defaultDatasets) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;
  this.aceHTMLOptions = aceHTMLOptions;

  this.datasetTypes = datasetTypes;

  this.validators = {
    datasetEditor: true
  };

  this.helpers({
    user: () => Users.findOne({}),
    dataset: () => PlaygroundDatasets.findOne({_id: self.getReactively('user.selectedIds.playgroundDatasetId')})
  });

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch('datasetCtrl.dataset', _.debounce((newVal) => {
    if (self.datasetEditorForm) self.validators.datasetEditor = self.datasetEditorForm.$valid;
    self.itemStream.onNext({
      valid: self.validators.datasetEditor,
      item: self.dataset
    });
  }, 1000), true);

  this.updateDatabase = (val) => {
    Meteor.call('playgroundDataset.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  this.stringifiedData = undefined;
  this.stringifyData = () => {
    self.stringifiedData = self.lastDataObject.isData ?
    JSON.stringify(self.lastDataObject.data, null, 2) :
    JSON.stringify(self.lastDataObject, null, 2);
  }

  this.showBriefly = undefined;
  this.brieflyShow = (text) => {
    this.showBriefly = text;
    // if (self.briefTimer) self.briefTimer();
    self.briefTimer = $timeout(() => {
      self.showBriefly = undefined;
    }, 3000); // 3 seconds
  }

  //update database
  self.itemStream
  .skip(1)
  .filter(x => x.valid)
  .map(x => x.item)
  .doOnNext(x => {
    self.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

  readState.pipeline.findReactiveData(self.dataset._id).stream.doOnNext(x => {
    self.lastDataObject = x;
    $timeout();
  }).subscribe(new Rx.ReplaySubject(0));
}];
