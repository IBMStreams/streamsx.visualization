var exports = module.exports = {}

let Rx = require('rx').Rx;

const visualizationDirective = ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      vizObject: '='
    },
    link: function($scope, $el, $attrs, $ctrl) {
      var linkFn = undefined;
      var cleanupFn = undefined;

      let vizOptions = eval('(' + $scope.vizObject.options + ')');
      let myModules = require('../../../mymodules/mymodules.js').myModules;

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

      try {
        (function evalLinkFn() {
          linkFn = eval('(' + $scope.vizObject.initFunction + ')');
        })();
      } catch (e) {
        console.log('error in eval of linkFn', e);
      }

      $timeout(function () {
        try {
          linkFn($scope, $el, $attrs, $ctrl);
        } catch (e) {
          console.log('error in execution of linkFn', e);
        }
        $scope.disposableSubs = $scope.vizObject.inputs.map(function(input) {
          let dataHandler = undefined;
          (function evalDataHandler() {
            dataHandler = eval('(' + input.dataHandler + ')');
          })();

          return input.reactiveData.stream.doOnNext(function(data) {
            console.log('got input data', data);
            if (data.isData) {
              try {
                console.log('invoking data handler with', data.data);
                dataHandler(data.data);
              } catch (e) {
                console.log('error while executing data handler for input');
                console.log(e);
              }
              console.log('finished executing dataHandler');
            }
            else {
              console.log('input data has errors');
            }
          }).subscribe(Rx.ReplaySubject(0));
        });
      }, 0);
      console.log('visualization link function executed');
    }
  }
}];

exports.visualizationDirective = visualizationDirective;

// $scope.linking = {
//   success: true,
//   error: undefined
// }
// } catch (e) {
//   $scope.linking = {
//     success: false,
//     error: e
//   }
// }
