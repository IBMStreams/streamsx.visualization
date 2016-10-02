import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataPanels} from '/imports/api/datapanels';
import {DataSets} from '/imports/api/datasets';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const dataSetCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory', 'readState',
'dataSetTypes', 'reactivePipeline',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory, readState, dataSetTypes) {
  $reactive(this).attach($scope);
  let self = this;

  this.selectedTab = 'editor';

  this.user = Users.findOne({});
  this.app = Apps.findOne({_id: self.user.selectedIds.appId});
  this.dataPanel = DataPanels.findOne({_id: self.app.selectedDataPanelId});
  this.dataSet = DataSets.findOne({_id: self.dataPanel.selectedDataSetId});
  this.dataSets = DataSets.findOne({dataPanelId: self.dataPanel._id});

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

  this.rds = readState.pipeline.findReactiveData(self.dataSet._id);

  this.rds.stream.doOnNext(x => {
    self.lastDataObject = x;
  }).subscribe(new Rx.ReplaySubject(0));

}];
