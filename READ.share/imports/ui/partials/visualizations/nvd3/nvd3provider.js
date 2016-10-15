import templateUrl from './nvd3.html';

export const nvd3ProviderComponent = {
  // create a proper html template and handle errors as part of the template...
  templateUrl: templateUrl,
  bindings: {
    message: '<',
    options: '<',
    dim: '<'
  },
  controller: ['$scope', '$rootScope', '$timeout', ($scope, $rootScope, $timeout) => {
    let self = this;
    $scope.ready = false;
    $scope.options = {
      chart: {}
    };

    // handle options change
    $scope.$watch('nvd3Controller.options', x => {
      delete x.chart.height;
      delete x.chart.width;
      angular.extend($scope.options, x);
      if ($scope.options.chart.type && $scope.options.chart.height) $scope.ready = true;
    }, true);

    // use this for anything?
    $scope.api = {};

    $rootScope.$on('sidebar-toggled', () => {
      $timeout(() => {
        angular.extend($scope.options.chart, self.dim);
        if ($scope.options.chart.type && $scope.options.chart.height) $scope.ready = true;
        if ($scope.ready && $scope.api.update) $scope.api.update();
      }, 10);
    });

    $scope.$watch('nvd3Controller.dim', (newVal, oldVal) => {
      angular.extend($scope.options.chart, newVal);
      if ($scope.options.chart.type && $scope.options.chart.height) $scope.ready = true;
      if ($scope.ready && $scope.api.update) $scope.api.update();
    }, true);
  }],
  controllerAs: 'nvd3Controller'
}
