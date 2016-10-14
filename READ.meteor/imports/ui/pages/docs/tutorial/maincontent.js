import createAppTemplate from './createapp.html';
import simpleHTTPTemplate from './simplehttp.html';

export const tutorialMainContentCtrl = ['$scope', 'readState', '$uibModal', function ($scope, readState, $uibModal) {
  readState.tutorialSection = 'createApp';

  this.openModel = (imagePath) => {
    var modalInstance = $uibModal.open({
      template: '<img style="width: 100%" src="' + imagePath + '"></img>',
      size: 'lg'
    })
  };
}];
