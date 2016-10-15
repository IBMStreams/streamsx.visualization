import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {DataSets} from '/imports/api/datasets';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const dashboardDataSetCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory',
'readState', 'dataSetTypes', 'defaultDataSets',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory,
  readState, dataSetTypes, defaultDataSets) {
  $reactive(this).attach($scope);
  let self = this;

  this.readState = readState;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dashboard: () => Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}),
    dataSet: () => DataSets.findOne({_id: self.getReactively('dashboard.selectedDataSetId')}),
    dataSets: () => DataSets.find({dashboardId: self.getReactively('dashboard._id')}).fetch(),
    descendants: () => readState.dependencies.getDescendants(self.getReactively('dashboard.selectedDataSetId')).map(x => x.id), // not _id
    candidateParents: () => DataSets.find({}).fetch().filter(ds => {
      if (ds._id === self.getReactively('dataSet._id')) return false;
      if (_.contains(self.getReactively('descendants'), ds._id)) return false;
      return true;
    }).map(ds => {
      ds.dashboardName = Dashboards.findOne({_id: ds.dashboardId}).name;
      return ds;
    })
  });

  this.dataSetTypes = dataSetTypes.filter(dsType => {
    if (! _.contains(['extendedHTTP', 'transformed'], dsType)) return true;
    else return self.candidateParents.length > 0;
  });

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
    let parentId = self.candidateParents[0]._id;

    let defaultDataSet = (self.dataSet.dataSetType === 'extendedHTTP') ?
    defaultDataSets.extendedHTTP(parentId) : defaultDataSets[self.dataSet.dataSetType];

    let newDataSet = angular.merge({
      _id: self.dataSet._id,
      userId: 'guest',
      appId: self.user.selectedIds.appId,
      dashboardId: self.app.selectedDashboardId,
      dataSetType: self.dataSet.dataSetType,
      name: self.dataSet.name
    }, defaultDataSet);
    self.updateDatabase(newDataSet);
    $state.reload($state.$current.name);
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