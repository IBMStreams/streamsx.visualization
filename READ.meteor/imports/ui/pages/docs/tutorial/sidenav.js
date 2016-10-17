import './cars/sidenav.html';
import './movies/sidenav.html';
import './timeseries/sidenav.html';
import './advancedusecases/sidenav.html';

export const tutorialSideNavCtrl = ['$scope', 'readState', function ($scope, readState) {
  this.readState = readState;
}];
