import _ from 'underscore/underscore';
import Rx from 'rx/dist/rx.all';

import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

export const nvd3VisualizationComponent = {
  template: '<nvd3-provider message="$ctrl.canonicalDataObject" options="$ctrl.advancedOptions" dim="$ctrl.dim"></nvd3-provider>',
  bindings: {
    visualization: '<',
    dim: '<'
  },
  controller: ['$scope', '$reactive', '$timeout', 'reactiveDataFactory', 'readState',
  'reactivePipeline',
  function ($scope, $reactive, $timeout, reactiveDataFactory, readState, reactivePipelineService) {
    $reactive(this).attach($scope);
    let self = this;

    this.$onInit = function() {

      self.helpers({
        template: () => Playground.findOne({_id: self.visualization.templateId}),
        basicOptionsSchema: () => {
          self.basicOptionsSchemaObject = Playground.findOne({_id: self.getReactively('template.basicOptionsSchemaId')});
          return eval("(" + self.basicOptionsSchemaObject.jsonSchema + ")");
        }
      });

      self.advancedOptions = eval("(" + self.visualization.advancedOptions + ")");

      let reactivePipeline = reactivePipelineService.getInstance();
      let tds = reactivePipeline.addReactiveData(readState.pipeline.findReactiveData(self.visualization.dataSetId));

      self.inputSchemaObject = Playground.findOne({_id: self.template.inputSchemaId});
      let validatedDataSet = {
        _id: "validatedData",
        name: "Validated Data",
        dataSetType: "validated",
        jsonSchema: self.inputSchemaObject.jsonSchema,
        parentId: self.visualization.dataSetId
      };
      let vds = reactivePipeline.addDataSet(validatedDataSet);

      let basicOptionsDataSet = {
        _id: "basicOptions",
        name: "Basic Options",
        dataSetType: "raw",
        rawData: self.visualization.basicOptions
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
        transformFunction: self.template.canonicalTransform
      };
      let cds = reactivePipeline.addDataSet(canonicalDataSet);

      cds.stream.doOnNext(x => {
        self.canonicalDataObject = x;
        $timeout();
      }).subscribe(new Rx.ReplaySubject(0));

    }
    // We are knocking out the below for performance reasons... we can revisit later.
    /*
    this.canonicalSchemaObject = Playground.findOne({_id: self.template.canonicalSchemaId});
    let validatedCanonicalDataSet = {
    _id: "validatedCanonicalData",
    name: "Validated Canonical Data",
    dataSetType: "validated",
    jsonSchema: self.canonicalSchemaObject.jsonSchema,
    parentId: "canonicalData"
  };
  let vcds = reactivePipeline.addDataSet(validatedCanonicalDataSet);
  vcds.stream.doOnNext(x => $timeout(() => (self.canonicalDataObject = x), 0)).subscribe(new Rx.ReplaySubject(0));
  */
}]
}
