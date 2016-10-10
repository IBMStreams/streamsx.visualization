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
      let template = '<leaflet height="{{dim.height}}"></leaflet>';
      let content = $compile(template)($scope);
      $element.append(content);
    }
  }
}
