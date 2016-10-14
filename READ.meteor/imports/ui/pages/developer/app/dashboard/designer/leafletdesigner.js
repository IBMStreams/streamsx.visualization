import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';

import {aceJsonSchemaOptions, aceJavaScriptOptions, aceHTMLOptions} from '/imports/ui/partials/aceoptions';

export const leafletVizDesignCtrl = ['$scope', '$reactive', '$timeout', '$state', 'reactiveDataFactory', 'readState',
'reactivePipeline',
function ($scope, $reactive, $timeout, $state, reactiveDataFactory, readState, reactivePipelineService) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  this.helpers({
    template: () => Playground.findOne({_id: $scope.designerCtrl.visualization.templateId})
  });

}];
