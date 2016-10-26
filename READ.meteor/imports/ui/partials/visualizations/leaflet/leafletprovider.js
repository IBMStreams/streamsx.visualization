import templateUrl from './leaflet.html';

export const leafletProviderComponent = {
  templateUrl: templateUrl,
  bindings: {
    message: '<',
    dim: '<'
  },
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

      let template = '<leaflet ' + templateOptions.join(' ') + ' ' + 'height="{{dim.height}}"></leaflet>';
      let content = $compile(template)($scope);
      $element.append(content);
    }
  }
}
