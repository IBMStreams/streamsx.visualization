import angular from 'angular';
import rawDataEditorTemplateUrl from './rawdataeditor.html';
import Rx from 'rx/dist/rx.all';

let name = 'read.dataSetEditors';

let angularModule = angular.module(name, []);

angularModule.value('dataSetTypes', [{
  name: 'raw',
  displayName: 'Raw'
}]);

angularModule.value('defaultDataSets', {
  raw: {
    rawData: '{}'
  }
});

let rawDataEditorCtrl = ['$scope', function($scope) {
  //update database
  $scope.dataSetCtrl.itemStream
  .filter(x => x.valid)
  .map(x => x.item)
  .debounce(100)
  .doOnNext(x => {
    $scope.dataSetCtrl.updateDatabase(x);
  }).subscribe(new Rx.ReplaySubject(0));

}];

angularModule.directive('rawDataEditor', function() {
  return {
    templateUrl: rawDataEditorTemplateUrl,
    controller: rawDataEditorCtrl,
    controllerAs: 'dataSetEditorCtrl'
  }
});

export default angularModule;
