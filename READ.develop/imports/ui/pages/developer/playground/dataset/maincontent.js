import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import Rx from 'rx/dist/rx.all';

import {Users} from '/imports/api/users';
import {PlaygroundDatasets} from '/imports/api/playgrounddatasets';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const playgroundDatasetCtrl = ['$scope', '$reactive', 'readState', '$state', 'datasetTypes', 'defaultDatasets',
function($scope, $reactive, readState, $state, datasetTypes, defaultDatasets) {
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
  }, 100), true);

  this.updateDatabase = (val) => {
    Meteor.call('playgroundDataset.update', val._id, val, (err, res) => {
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

  this.rds = readState.pipeline.findReactiveData(self.dataset._id);

  this.rds.stream.doOnNext(x => {
    self.lastDataObject = x;
    $timeout(); // this seems necessary for propagating changes to the view...
  }).subscribe(new Rx.ReplaySubject(0));
}];
