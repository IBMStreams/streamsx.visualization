import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import ajv from 'ajv';
import Rx from 'rx/dist/rx.all';

import {Users} from '/imports/api/users';
import {Playground} from '/imports/api/playground';
import {reactiveDataFactory} from 'read-common/imports/api/client/reactivedatafactory'
import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const leafletMainContentCtrl = ['$scope', '$reactive', '$timeout', '$state', 'readState', 'reactiveDataFactory', 'reactivePipeline',
function ($scope, $reactive, $timeout, $state, readState, reactiveDataFactory, reactivePipelineService) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;
  this.aceHTMLOptions = aceHTMLOptions;

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Playground.find({pluginType: 'leaflet'}).fetch(),
    item: () => self.getReactively('user.selectedIds.leafletId') ?
    Playground.findOne({_id: self.user.selectedIds.leafletId}) : undefined,
    dataSchemas: () => Playground.find({pluginType: 'Data Schema'}).fetch(),
    inputSchemaObject: () => self.getReactively('item.inputSchemaId') ?
    Playground.findOne({_id: self.item.inputSchemaId}) : undefined
  });

  this.validItem = () => { // because of crummy ui-ace not working with ng-show; would rather use $valid
    return self.validators.testData
  };

  this.validators = {
    testData: true
  };

  // update database
  this.updateDatabase = (val) => {
    Meteor.call('playground.update', val._id, val, (err, res) => {
      if (err) alert(err);
    });
  };

  this.dimensions = {
    height: undefined,
    width: undefined
  };

  this.itemStream = new Rx.ReplaySubject(0);
  $scope.$watch('mainContentCtrl.item', _.debounce(function(item) {
    $scope.$apply(function() {
      if (self.testDataForm) self.validators.testData = self.testDataForm.$valid;
      self.itemStream.onNext({
        valid: self.validItem(),
        item: item
      });
    });
  }, 2), true); // the 2 milli second debounce is for validators and reactive computes to kick in.

  //update database
  self.itemStream
  .skip(1)
  .filter(x => x.valid)
  .map(x => x.item)
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
  let tds = reactivePipeline.addDataSet(testDataSet);

  let validatedDataSet = {
    _id: "validatedData",
    name: "Validated Data",
    dataSetType: "validated",
    jsonSchema: self.inputSchemaObject.jsonSchema,
    parentId: "testData"
  };
  let vds = reactivePipeline.addDataSet(validatedDataSet);

  vds.stream.doOnNext(x => (self.dataObject = x)).subscribe(new Rx.ReplaySubject(0));

  //update test data
  self.itemStream
  .filter(x => self.validators.testData)
  .map(x => x.item.testData)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    testDataSet.rawData = x;
    reactivePipeline.changeDataSet(testDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

  //update input schema
  self.itemStream
  .map(x => x.item.inputSchemaId)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    self.inputSchemaObject = Playground.findOne({_id: x});
    validatedDataSet.jsonSchema = self.inputSchemaObject.jsonSchema;
    reactivePipeline.changeDataSet(validatedDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

}];
