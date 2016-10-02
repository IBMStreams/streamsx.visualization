export const dashboardMainContentCtrl = ['$scope', 'readState', function($scope, readState) {
  console.log('intiatiating mainContentCtrl');

  this.readState = readState;
  this.gsOptions = {
    cellHeight: 80,
    verticalMargin: 10,
    staticGrid: true
  };
}];
