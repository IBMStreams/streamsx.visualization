import angular from 'angular';
import Rx from 'rx/dist/rx.all';

import rawDataEditorTemplateUrl from './rawdataeditor.html';
import simpleHTTPDataEditorTemplateUrl from './simplehttpdataeditor.html';
import transformedDataEditorTemplateUrl from './transformeddataeditor.html';

let name = 'read.dataSetEditors';

let angularModule = angular.module(name, []);

angularModule.value('dataSetTypes', [{
  name: 'raw',
  displayName: 'Raw'
}, {
  name: 'simpleHTTP',
  displayName: 'URL'
}, {
  name: 'transformed',
  displayName: 'Transform'
}]);

angularModule.value('defaultDataSets', {
  raw: {
    rawData: '{}'
  },
  simpleHTTP: {
    url: 'http://properurl.org/jsondata',
    poll: {
      enabled: false,
      intervalSec: 20
    }
  },
  transformed: {
    parents: [],
    transformFunction: 'x => x',
    stateParams: {
      enabled: false,
      state: '{\n  initialValue: 17\n}'
    }
  }
});

angularModule.directive('rawDataEditor', function() {
  return {
    templateUrl: rawDataEditorTemplateUrl
  }
}).directive('simpleHttpDataEditor', function() {
  return {
    templateUrl: simpleHTTPDataEditorTemplateUrl
  }
}).directive('transformedDataEditor', function() {
  return {
    templateUrl: transformedDataEditorTemplateUrl
  }
})

export default angularModule;
