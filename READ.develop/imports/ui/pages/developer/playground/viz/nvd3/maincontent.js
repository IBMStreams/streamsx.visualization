import { Meteor } from 'meteor/meteor';
import _ from 'underscore/underscore';
import ajv from 'ajv';
import Rx from 'rx/dist/rx.all';

import {Users} from '/imports/api/users';
import {Playground} from '/imports/api/playground';
import {reactiveDataFactory} from 'read-common/imports/api/client/reactivedatafactory'
import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const nvd3MainContentCtrl = ['$scope', '$reactive', '$timeout', '$state', 'readState', 'reactiveDataFactory', 'reactivePipeline',
function ($scope, $reactive, $timeout, $state, readState, reactiveDataFactory, reactivePipelineService) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  this.aceJsonSchemaOptions = aceJsonSchemaOptions;
  this.aceJavaScriptOptions = aceJavaScriptOptions;
  this.aceHTMLOptions = aceHTMLOptions;

  this.validators = {
    testData: true,
    basicOptions: true,
    canonicalTransform: true,
    advancedOptions: true
  };

  this.helpers({
    user: () => Users.findOne({}),
    items: () => Playground.find({pluginType: 'NVD3'}).fetch(),
    item: () => Playground.findOne({_id: self.getReactively('user.selectedIds.nvd3Id')}),
    dataSchemas: () => Playground.find({pluginType: 'Data Schema'}).fetch(),
    inputSchemaObject: () => Playground.findOne({_id: self.getReactively('item.inputSchemaId')}),
    basicOptionsSchemaObject: () => Playground.findOne({_id: self.getReactively('item.basicOptionsSchemaId')}),
    basicOptionsSchema: () => {
      let bo = (self.getReactively('basicOptionsSchemaObject') ?
      eval("(" + self.getReactively('basicOptionsSchemaObject.jsonSchema') + ")") : undefined);
      return bo;
    },
    canonicalSchemaObject: () => Playground.findOne({_id: self.getReactively('item.canonicalSchemaId')}),
    advancedOptions: () => {
      let ao = undefined;
      try {
        ao = eval("(" + self.getReactively('item.advancedOptions') + ")");
      } catch(e) {
        return undefined;
      }
      return ao;
    }
  });

  this.validItem = () => { // because of crummy ui-ace not working with ng-show; would rather use $valid
    return self.validators.testData &&
    self.validators.basicOptions &&
    self.validators.canonicalTransform &&
    self.validators.advancedOptions;
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
  $scope.$watch('mainContentCtrl.item', _.debounce((newVal) => {
    if (self.testDataForm) self.validators.testData = self.testDataForm.$valid;
    if (self.basicOptionsForm) {
      self.validators.basicOptions = self.basicOptionsForm.$valid
    };
    if (self.canonicalForm) self.validators.canonicalTransform = self.canonicalForm.$valid;
    if (self.advancedOptionsForm) self.validators.advancedOptions = self.advancedOptionsForm.$valid;

    self.itemStream.onNext({
      valid: self.validItem(),
      item: self.item
    });
  }, 2), true);

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

  let basicOptionsDataSet = {
    _id: "basicOptions",
    name: "Basic Options",
    dataSetType: "raw",
    rawData: self.item.basicOptions
  }
  let bods = reactivePipeline.addDataSet(basicOptionsDataSet);

  let validatedBasicOptionsDataSet = {
    _id: "validatedBasicOptions",
    name: "Validated Basic Options",
    dataSetType: "validated",
    jsonSchema: self.basicOptionsSchemaObject.jsonSchema,
    parentId: "basicOptions"
  };
  let vbods = reactivePipeline.addDataSet(validatedBasicOptionsDataSet);

  let canonicalDataSet = {
    _id: 'canonicalData',
    name: "Canonical Data",
    dataSetType: "transformed",
    stateParams: {
      enabled: false
    },
    parents: ['validatedData', 'validatedBasicOptions'],
    transformFunction: self.item.canonicalTransform
  };
  let cds = reactivePipeline.addDataSet(canonicalDataSet);

  let validatedCanonicalDataSet = {
    _id: "validatedCanonicalData",
    name: "Validated Canonical Data",
    dataSetType: "validated",
    jsonSchema: self.canonicalSchemaObject.jsonSchema,
    parentId: "canonicalData"
  };
  let vcds = reactivePipeline.addDataSet(validatedCanonicalDataSet);

  vcds.stream.doOnNext(x => {
    self.canonicalDataObject = x;
  }).subscribe(new Rx.ReplaySubject(0));

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

  //update basic options
  self.itemStream
  .filter(x => self.validators.basicOptions)
  .map(x => x.item.basicOptions)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    basicOptionsDataSet.rawData = x;
    reactivePipeline.changeDataSet(basicOptionsDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

  //update basic options schema
  self.itemStream
  .map(x => x.item.basicOptionsSchemaId)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    self.basicOptionsSchemaObject = Playground.findOne({_id: x});
    validatedBasicOptionsDataSet.jsonSchema = self.basicOptionsSchemaObject.jsonSchema;
    reactivePipeline.changeDataSet(validatedBasicOptionsDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

  //update canonical transform
  self.itemStream
  .filter(x => self.validators.canonicalTransform)
  .map(x => x.item.canonicalTransform)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    canonicalDataSet.transformFunction = x;
    reactivePipeline.changeDataSet(canonicalDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

  //update canonical schema
  self.itemStream
  .map(x => x.item.canonicalSchemaId)
  .distinctUntilChanged() // should this be object compare for performance?
  .doOnNext(x => {
    self.canonicalSchemaObject = Playground.findOne({_id: x});
    validatedCanonicalDataSet.jsonSchema = self.canonicalSchemaObject.jsonSchema;
    reactivePipeline.changeDataSet(validatedCanonicalDataSet);
  }).subscribe(new Rx.ReplaySubject(0));

}];
