import { Playground } from '/imports/api/playground';
import { Users } from '/imports/api/users';

export default mainContentCtrl = ['$scope', '$reactive', '$timeout', function($scope, $reactive, $timeout) {
  $reactive(this).attach($scope);

  let self = this;

  this.aceJsonSchemaOptions = {
    mode: 'json',
    showIntentGuides: true,
    showPrintMargin: false,
    useSoftTabs: true,
    useWrapMode: true,
    behavioursEnabled: true,
    wrapBehavioursEnable: true,
    theme: 'github'
  };

  this.aceTestDataOptions = {
    mode: 'javascript',
    showIntentGuides: true,
    showPrintMargin: false,
    useSoftTabs: true,
    useWrapMode: true,
    behavioursEnabled: true,
    wrapBehavioursEnable: true,
    theme: 'github'
  };

}];
