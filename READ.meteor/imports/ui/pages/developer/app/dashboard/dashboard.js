// this needs to work for both shared and dev dashboards...
export const dashboardCtrl = ['$scope', '$reactive', '$timeout', '$state', 'readState',
function ($scope, $reactive, $timeout, $state, readState) {
  $reactive(this).attach($scope);
  let self = this;

  this.gsOptions = {
      cellHeight: 80,
      verticalMargin: 10
  };
  
}];
