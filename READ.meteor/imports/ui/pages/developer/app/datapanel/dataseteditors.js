import angular from 'angular';
import Rx from 'rx/dist/rx.all';

import rawDataEditorTemplateUrl from './rawdataeditor.html';
import simpleHTTPDataEditorTemplateUrl from './simplehttpdataeditor.html';

let name = 'read.dataSetEditors';

let angularModule = angular.module(name, []);

angularModule.value('dataSetTypes', [{
  name: 'raw',
  displayName: 'Raw'
}, {
  name: 'simpleHTTP',
  displayName: 'URL'
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
  }
});

angularModule.directive('rawDataEditor', function() {
  return {
    templateUrl: rawDataEditorTemplateUrl
  }
});

angularModule.directive('simpleHttpDataEditor', function() {
  return {
    templateUrl: simpleHTTPDataEditorTemplateUrl
  }
});

export default angularModule;
