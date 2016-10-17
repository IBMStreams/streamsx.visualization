import './cars/maincontent.html';
import './movies/maincontent.html';
import './timeseries/maincontent.html';
import './advancedusecases/maincontent.html';

import './timeseries/createapp.html';
import './timeseries/timeseriescharts.html';

import './advancedusecases/statefultransform.html';


export const tutorialMainContentCtrl = ['$scope', 'readState', '$uibModal', function ($scope, readState, $uibModal) {
  this.readState = readState;

  this.switch = (tutorial, section) => {
    readState.sidebar.tutorial = section;
    readState.mainContentSelectedTab.tutorial = tutorial;
  };

  this.openModel = (imagePath) => {
    var modalInstance = $uibModal.open({
      template: '<img style="width: 100%" src="' + imagePath + '"></img>',
      size: 'lg'
    })
  };
}];
