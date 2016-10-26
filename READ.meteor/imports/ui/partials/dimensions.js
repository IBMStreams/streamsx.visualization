import Rx from 'rx/dist/rx.all';
import angular from 'angular';

export const dimensionsDirective = ['$window', '$timeout', function($window, $timeout) {
  return {
    restrict: 'A',
    link: function($scope, $el, $attrs, $ctrl) {
      // compute dimensions here
      let dimensions = $scope.$eval($attrs['dimensions']);

      // this should work even if we are using gridster type things
      // as long as the user interactions affect scope properties like x and y sizes
      // of course it works for window resize events naturally
      $($window).resize(() => {
        dimensions.height = $el.height();
        dimensions.width = $el.width();
        $scope.$apply();
      });

      $scope.$watch(_.debounce(() => {
        console.log('dimensions watch firing');
        dimensions.height = $el.height();
        dimensions.width = $el.width();
      }, 100), () => {});

    }
  };
}]
