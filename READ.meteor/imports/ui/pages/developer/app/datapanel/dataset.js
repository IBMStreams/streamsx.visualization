import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const dataSetCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory',
'readState', 'dataSetTypes', 'defaultDataSets',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory,
  readState, dataSetTypes, defaultDataSets) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.user = Users.findOne({});
  this.app = Apps.findOne({_id: self.user.selectedIds.appId});
  this.dataPanel = DataPanels.findOne({_id: self.app.selectedDataPanelId});
  this.dataSet = DataSets.findOne({_id: self.dataPanel.selectedDataSetId});
  this.dataSets = DataSets.findOne({dataPanelId: self.dataPanel._id});
  this.descendants = readState.dependencies.getDescendants(self.dataPanel.selectedDataSetId).map(x => x.id); // not _id
  this.candidateParents = DataSets.find({}).fetch().filter(ds => {
    if (ds._id === self.dataSet._id) return false;
    if (_.contains(self.descendants, ds._id)) return false;
    return true;
  }).map(ds => {
    ds.dataPanelName = DataPanels.findOne({_id: ds.dataPanelId}).name;
    return ds;
  });

  this.dataSetTypes = dataSetTypes;
  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;
  this.aceHTMLOptions = aceHTMLOptions;

  let watcher = $scope.$watch('dataSetCtrl.dataSet', newVal => {
    if (newVal) {
      self.dataSet.readOnly = self.app.readOnly;
      watcher();
    }
  });

  this.validators = {
    dataSetEditor: true
  };

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch(() => { // because of crummy ui-ace not working with ng-show
    if (self.dataSetEditorForm) self.validators.dataSetEditor = self.dataSetEditorForm.$valid;
    return {
      valid: self.validators.dataSetEditor,
      item: self.dataSet
    };
  }, (newVal) => {
    self.itemStream.onNext(newVal);
  }, true);

  this.updateDatabase = (val) => {
    Meteor.call('dataSet.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  this.updateDataSetType = () => {
    let newDataSet = angular.merge({
      _id: self.dataSet._id,
      userId: 'guest',
      appId: self.user.selectedIds.appId,
      dataPanelId: self.app.selectedDataPanelId,
      dataSetType: self.dataSet.dataSetType,
      name: self.dataSet.name
    }, defaultDataSets[self.dataSet.dataSetType]);
    self.updateDatabase(newDataSet);
    $state.reload('read.developer.app.datapanel');
  };

  //update database
  self.itemStream
  .skip(1)
  .filter(x => x.valid)
  .map(x => x.item)
  .doOnNext(x => {
    self.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

  this.rds = readState.pipeline.findReactiveData(self.dataSet._id);

  this.rds.stream.doOnNext(x => {
    self.lastDataObject = x;
  }).subscribe(new Rx.ReplaySubject(0));

}];
