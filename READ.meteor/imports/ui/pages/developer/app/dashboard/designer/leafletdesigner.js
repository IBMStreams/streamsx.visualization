import { Meteor } from 'meteor/meteor';

import {Playground} from '/imports/api/playground';

export const leafletVizDesignCtrl = ['$scope', '$reactive', 'readState', function ($scope, $reactive, readState) {
  $reactive(this).attach($scope);
  let self = this;
  this.readState = readState;

  this.helpers({
    template: () => Playground.findOne({_id: $scope.designerCtrl.visualization.templateId})
  });

}];
