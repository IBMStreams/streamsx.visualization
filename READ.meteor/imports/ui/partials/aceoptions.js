import angular from 'angular';
import _ from 'underscore';
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

export const validJsonDirective = () => {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $el, $attrs, $ctrl) {
      if (!$ctrl) return;
      let validJsonChecker = (new ajv()).compile({});

      let assignCheckerAndValidate = (jsonSchema) => {
        try {
          validJsonChecker = (new ajv()).compile(jsonSchema);
        } catch (e) {
          console.log("jsonSchema compilation error in validJsonDirective -- will resort to default schema");
          validJsonChecker = (new ajv()).compile({});
        }
        $ctrl.$validate();
      };

      $attrs.$observe('jsonSchema', (jsonSchemaVarStr) => {
        assignCheckerAndValidate($scope.$eval(jsonSchemaVarStr) || {});
        $scope.$watch(jsonSchemaVarStr, function(newVal, oldVal) {
          assignCheckerAndValidate(newVal || {});
        }, true); // deep watch
      });

      $ctrl.$validators.validJson = (modelValue, viewValue) => {
        try {
          return validJsonChecker(eval("(" + viewValue + ")"));
        } catch(e) {
          return false;
        }
      };

    }
  };
}

export const validObjectDirective = () => {
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

export const validFunctionDirective = () => {
  let directiveDefinitionsObject = {
    require: 'ngModel',
    link: function($scope, $el, $attrs, $ctrl) {
      $ctrl.$validators.validFunction = function(modelValue, viewValue) { // valid js function
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
