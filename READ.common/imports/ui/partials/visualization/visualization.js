var exports = module.exports = {}

let Rx = require('rx').Rx;

const visualizationDirective = ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      vizObject: '='
    },
    link: function($scope, $el, $attrs, $ctrl) {
      try {
        var linkFn = undefined;
        let vizOptions = eval('(' + $scope.vizObject.options + ')');
        (function evalLinkFn() {
          linkFn = eval('(' + $scope.vizObject.initFunction + ')');
        })();
        linkFn($scope, $el, $attrs, $ctrl);

        var cleanupFn = undefined;
        (function evalCleanupFn() {
          cleanupFn = eval('(' + $scope.vizObject.cleanupFunction + ')');
        })();
        $scope.$on('$destroy', () => {
          try {
            cleanupFn();
          } catch (e) {
            console.log('clean up error', e);
          }
        });

        $scope.disposableSubs = $scope.vizObject.inputs.map(input => {
          let dataHandler = undefined;
          (function evalDataHandler() {
            dataHandler = eval('(' + input.dataHandler + ')');
          })();

          return input.reactiveData.stream.doOnNext(data => {
            console.log('got input data', data);
            if (data.isData) {
              try {
                dataHandler(data.data);
              } catch (e) {
                console.log('error while executing data handler for input');
                console.log(e);
              }
              console.log('finished executing dataHandler');
            }
            else console.log('input data has errors');
            $timeout();
          }).subscribe(Rx.ReplaySubject(0));
        });

        $scope.linking = {
          success: true,
          error: undefined
        }
      } catch (e) {
        $scope.linking = {
          success: false,
          error: e
        }
      }
    }
  };
}];

exports.visualizationDirective = visualizationDirective;
