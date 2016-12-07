import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import Rx from 'rx/dist/rx.all';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {DataSets} from '/imports/api/datasets';

import './rawdatausageinfo.html';
import './simplehttpdatausageinfo.html';
import './websocketdatausageinfo.html';
import './transformdatausageinfo.html';

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
    descendants: () => readState.dependencies.getDescendants(self.getReactively('dashboard.selectedDataSetId')).map(x => x.id),
    candidateParents: () => DataSets.find({}).fetch().filter(ds => {
      if (ds._id === self.getReactively('dataSet._id')) return false;
      if (_.contains(self.getReactively('descendants'), ds._id)) return false;
      return true;
    }).map(ds => {
      ds.dashboardName = Dashboards.findOne({_id: ds.dashboardId}).name;
      return ds;
    }),
    rds: () => readState.pipeline.findReactiveData(self.getReactively('dataSet._id'))
  });

  this.dataSetTypes = dataSetTypes.filter(dsType => {
    if (! _.contains(['extendedHTTP'], dsType.name)) return true;
    else return false; // we are not allowing extendedHTTP until things are fixed...
       // return true;
  });

  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;
  this.aceHTMLOptions = aceHTMLOptions;

  let watcher = $scope.$watch('dataSetCtrl.dataSet', newVal => {
    if (newVal) {
      self.dataSet.readOnly = self.user.readOnly;
      watcher();
    }
  });

  this.validators = {
    dataSetEditor: true
  };

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch('dataSetCtrl.dataSet', _.debounce((newVal) => {
    if (self.dataSetEditorForm) self.validators.dataSetEditor = self.dataSetEditorForm.$valid;
    self.itemStream.onNext({
      valid: self.validators.dataSetEditor,
      item: self.dataSet
    });
  }, 100), true);

  this.updateDatabase = (val) => {
    Meteor.call('dataSet.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  this.updateDataSetType = () => {
    let defaultDataSet = (self.dataSet.dataSetType === 'extendedHTTP') ?
    defaultDataSets.extendedHTTP(self.candidateParents[0]._id) : defaultDataSets[self.dataSet.dataSetType];

    let newDataSet = angular.merge({
      _id: self.dataSet._id,
      userId: 'guest',
      appId: self.user.selectedIds.appId,
      dashboardId: self.app.selectedDashboardId,
      dataSetType: self.dataSet.dataSetType,
      name: self.dataSet.name
    }, defaultDataSet);
    self.updateDatabase(newDataSet);
    $state.reload('read.developer.app.dashboard');
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
    $scope.lastDataObject = x;
    $timeout(); // this seems necessary for propagating changes to the view... what a lousy hack! */
  }).subscribe(new Rx.ReplaySubject(0));


}];
