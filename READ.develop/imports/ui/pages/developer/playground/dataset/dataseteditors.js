import angular from 'angular';
import Rx from 'rx/dist/rx.all';

import rawDataEditorTemplateUrl from './rawdataeditor.html';
import './rawdatausageinfo.html';

let angularModule = angular.module('read.dataset', []);

angularModule.value('datasetTypes', [{
  name: 'Raw',
  displayName: 'Raw'
}, {
  name: 'URL',
  displayName: 'URL'
}, {
  name: 'WebSocket',
  displayName: 'WebSocket'
}, {
  name: 'Derived',
  displayName: 'Derived'
}]);

// needs to be a factory with factory methods for getting default values...
angularModule.factory('defaultDatasets', function() {
  let myFactory = {
    Raw: {
      rawData: '{}'
    },
    URL: {
      url: 'http://proper.url/returning/jsondata',
      poll: {
        enabled: false,
        intervalMilliSec: 1000
      }
    },
    WebSocket: {
      url: 'ws://proper.websocket.url/accepting/connections'
    },
    Derived: {
      parents: [],
      transformFunction: 'x => x'
    }
  };
  return myFactory;
});

angularModule.directive('rawDataEditor', function() {
  return {
    templateUrl: rawDataEditorTemplateUrl
  }
});
// .directive('simpleHttpDataEditor', function() {
//   return {
//     templateUrl: simpleHTTPDataEditorTemplateUrl
//   }
// }).directive('websocketDataEditor', function() {
//   return {
//     templateUrl: websocketDataEditorTemplateUrl
//   }
// }).directive('transformedDataEditor', function() {
//   return {
//     templateUrl: transformedDataEditorTemplateUrl
//   }
// }).directive('extendedHttpDataEditor', function() {
//   return {
//     templateUrl: extendedHTTPDataEditorTemplateUrl
//   }
// });

export default angularModule;
