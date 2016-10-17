import carsSideNavTemplate from './cars/sidenav.html';
import moviesSideNavTemplate from './movies/sidenav.html';
import timeSeriesSideNavTemplate from './timeseries/sidenav.html';

export const tutorialSideNavCtrl = ['$scope', 'readState', function ($scope, readState) {
  this.readState = readState;
}];
