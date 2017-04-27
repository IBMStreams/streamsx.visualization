import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import ajv from 'ajv';
import Rx from 'rx/dist/rx.all'

import {Users} from '/imports/api/users';
import {Playground} from '/imports/api/playground';

import {reactiveDataFactory} from 'read-common/imports/api/client/reactivedatafactory'
import {aceJsonSchemaOptions, aceJavaScriptOptions} from '/imports/ui/partials/aceoptions';

export const schemaMainContentCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory', 'readState', 'reactivePipeline',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory, readState, reactivePipelineService) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Playground.find({pluginType: 'Data Schema'}).fetch(),
    item: () => self.getReactively('user.selectedIds.dataSchemaId') ?
    Playground.findOne({_id: self.user.selectedIds.dataSchemaId}) : undefined
  });

  this.validators = {
    testData: true,
    jsonSchema: true
  };

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('playground.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  this.wellDefinedJSONSchema = (jsonSchemaStr) => {
    try {
      let jsonSchema = eval("(" + jsonSchemaStr + ")");
      let x = (new ajv()).compile(jsonSchema);
      return true;
    } catch (e) {
      return false;
    }
  };

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch(() => { // because of crummy ui-ace not working with ng-show
    if (self.schemaForm) self.validators.jsonSchema = self.schemaForm.$valid && self.wellDefinedJSONSchema(self.item.jsonSchema);
    if (self.dataForm) self.validators.testData = self.dataForm.$valid;
    return {
      valid: self.validators.testData && self.validators.jsonSchema,
      item: self.item
    };
  }, (newVal) => {
    self.itemStream.onNext(newVal);
  }, true);

  //update database
  this.itemStream
  .skip(1)
  .filter(x => x.valid)
  .map(x => x.item) // only valid items pass through
  .doOnNext(x => {
    self.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

  let reactivePipeline = reactivePipelineService.getInstance();

  let testDataSet = {
    _id: "testData",
    name: "Test Data",
    dataSetType: "raw",
    rawData: self.item.testData
  };
  reactivePipeline.addDataSet(testDataSet);

  let validatedDataSet = {
    _id: "validatedData",
    name: "Validated Data",
    dataSetType: "validated",
    jsonSchema: self.item.jsonSchema,
    parentId: "testData"
  };
  let vds = reactivePipeline.addDataSet(validatedDataSet);

  vds.stream.doOnNext(x => {
    self.lastDataObject = x;
  }).subscribe(new Rx.ReplaySubject(0));

  this.itemStream
  .filter(x => self.validators.testData)
  .map(x => {
    return x.item.testData;
  })
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    testDataSet.rawData = x;
    reactivePipeline.changeDataSet(testDataSet); // debug this func.
  }).subscribe(new Rx.ReplaySubject(0));

  self.itemStream
  .filter(x => self.validators.jsonSchema)
  .map(x => x.item.jsonSchema)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    validatedDataSet.jsonSchema = x;
    reactivePipeline.changeDataSet(validatedDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

}];
