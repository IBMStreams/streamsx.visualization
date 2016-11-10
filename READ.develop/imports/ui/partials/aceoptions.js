import angular from 'angular';
import _ from 'underscore/underscore';
import ajv from 'ajv';

let aceOptions = {
  showIntentGuides: true,
  showPrintMargin: false,
  useSoftTabs: true,
  useWrapMode: true,
  behavioursEnabled: true,
  wrapBehavioursEnable: true,
  theme: 'github'
};

export const aceJsonSchemaOptions = angular.merge({
  mode: 'json'
}, aceOptions);

export const aceJavaScriptOptions = angular.merge({
  mode: 'javascript'
}, aceOptions);

export const aceHTMLOptions = angular.merge({
  mode: 'html'
}, aceOptions);

export function validJsonDirective() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $el, $attrs, $ctrl) {
      if (!$ctrl) return;
      let validJsonChecker = (new ajv()).compile({});

      let assignCheckerAndValidate = function(jsonSchema) {
        try {
          validJsonChecker = (new ajv()).compile(jsonSchema);
//          console.log('using validJsonChecker from: ', jsonSchema);
        } catch (e) {
          console.log("jsonSchema compilation error in validJsonDirective -- will resort to default schema");
          validJsonChecker = (new ajv()).compile({});
        }
        $ctrl.$validate();
      };

      $attrs.$observe('jsonSchema', (jsonSchemaVarStr) => {
        assignCheckerAndValidate($scope.$eval(jsonSchemaVarStr) || {});
        $scope.$watch(jsonSchemaVarStr, function(newVal, oldVal) {
          // console.log('jsonSchema scope watch fired');
          assignCheckerAndValidate(newVal || {});
        }, true); // deep watch
      });

      $ctrl.$validators.validJson = function(modelValue, viewValue) {
        try {
          let val = validJsonChecker(eval("(" + viewValue + ")"));
//          console.log(val, validJsonChecker.errors, (new ajv().errorsText(validJsonChecker.errors)));
          return val;
        } catch(e) {
          return false;
        }
      };

    }
  };
}

export function validObjectDirective() {
  let directiveDefinitionsObject = {
    require: 'ngModel',
    link: function($scope, $el, $attrs, $ctrl) {
      $ctrl.$validators.validObject = function(modelValue, viewValue) { // object is javascript, not necessarily json
        try {
          return _.isObject(eval("(" + viewValue + ")"));
        } catch(e) {
          return false;
        }
      }
    }
  };
  return directiveDefinitionsObject;
}

export function validStateObjectDirective() {
  let directiveDefinitionsObject = {
    require: 'ngModel',
    link: function($scope, $el, $attrs, $ctrl) {
      $ctrl.$validators.validStateObject = function(modelValue, viewValue) { // object is javascript, not necessarily json
        try {
          return _.isObject(eval("(" + viewValue + ")")) || _.isNumber(eval("(" + viewValue + ")")) || _.isString(eval("(" + viewValue + ")"));
        } catch(e) {
          return false;
        }
      }
    }
  };
  return directiveDefinitionsObject;
}

export function validFunctionDirective() {
  let directiveDefinitionsObject = {
    require: 'ngModel',
    link: function($scope, $el, $attrs, $ctrl) {
      $ctrl.$validators.validFunction = function(modelValue, viewValue) { // valid js function
        if (_.isEmpty(viewValue)) return false;
        try {
          return _.isFunction(eval("(" + viewValue + ")"));
        } catch(e) {
          return false;
        }
      }
    }
  };
  return directiveDefinitionsObject;
}
