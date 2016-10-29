import templateUrl from './leaflet.html';

export const leafletProviderComponent = {
  templateUrl: templateUrl,
  bindings: {
    message: '<',
    dim: '<'
  },
  controller: ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
    $scope.ready = true;
    $rootScope.$on('sidebar-toggled', () => {
      $scope.ready = false;
      $timeout(() => {
        $scope.ready = true;
      }, 10);
    });
  }],
  controllerAs: 'leafletController'
};

export const leafletMapDirective = function($compile) {
  return {
    scope: {
      data: '<',
      dim: '<'
    },
    link: function($scope, $element) {
      let templateOptions = [];
      if ($scope.data.center) templateOptions.push('lf-center="data.center"');
      if ($scope.data.markers) templateOptions.push('markers="data.markers"');
      if ($scope.data.layers) templateOptions.push('layers="data.layers"');
      if ($scope.data.defaults) templateOptions.push('defaults="data.defaults"');
      if ($scope.data.legend) templateOptions.push('legend="data.legend"');
      if ($scope.data.geojson) templateOptions.push('geojson="data.geojson"');
      if ($scope.data.bounds) templateOptions.push('bounds="data.bounds"');
      if ($scope.data.maxbounds) templateOptions.push('maxbounds="data.maxbounds"');

      let template = '<leaflet ' + templateOptions.join(' ') + ' ' + 'height="{{dim.height}}"></leaflet>';
      let content = $compile(template)($scope);
      $element.append(content);
    }
  }
}
