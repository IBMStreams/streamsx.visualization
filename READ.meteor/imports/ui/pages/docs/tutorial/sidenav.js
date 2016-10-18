import './cars/sidenav.html';
import './movies/sidenav.html';
import './timeseries/sidenav.html';
import './dynamicrealtimecharts/sidenav.html';

export const tutorialSideNavCtrl = ['$scope', 'readState', function ($scope, readState) {
  this.readState = readState;
}];
