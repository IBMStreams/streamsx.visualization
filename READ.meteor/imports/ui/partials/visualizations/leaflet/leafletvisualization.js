import _ from 'underscore';
import Rx from 'rx/dist/rx.all'

import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

export const leafletVisualizationComponent = {
  template: '<leaflet-provider message="$ctrl.validatedDataObject" dim="$ctrl.dim"></leaflet-provider>',
  bindings: {
    visualization: '<',
    dim: '<'
  },
  controller: ['$scope', '$reactive', '$timeout', 'reactiveDataFactory', 'readState',
  'reactivePipeline',
  function ($scope, $reactive, $timeout, reactiveDataFactory, readState, reactivePipelineService) {
    $reactive(this).attach($scope);
    let self = this;

    this.helpers({
      template: () => Playground.findOne({_id: self.visualization.templateId})
    });

    let reactivePipeline = reactivePipelineService.getInstance();
    let tds = reactivePipeline.addReactiveData(readState.pipeline.findReactiveData(self.visualization.dataSetId));

    this.inputSchemaObject = Playground.findOne({_id: self.template.inputSchemaId});
    let validatedDataSet = {
      _id: "validatedData",
      name: "Validated Data",
      dataSetType: "validated",
      jsonSchema: self.inputSchemaObject.jsonSchema,
      parentId: self.visualization.dataSetId
    };
    let vds = reactivePipeline.addDataSet(validatedDataSet);
    vds.stream.doOnNext(x => (self.validatedDataObject = x)).subscribe(new Rx.ReplaySubject(0));
  }]
}
