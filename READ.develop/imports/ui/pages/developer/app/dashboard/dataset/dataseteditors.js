import angular from 'angular';
import Rx from 'rx/dist/rx.all';

import rawDataEditorTemplateUrl from './rawdataeditor.html';
import simpleHTTPDataEditorTemplateUrl from './simplehttpdataeditor.html';
import websocketDataEditorTemplateUrl from './websocketdataeditor.html';
import transformedDataEditorTemplateUrl from './transformeddataeditor.html';
import extendedHTTPDataEditorTemplateUrl from './extendedhttpdataeditor.html';

let name = 'read.dataSetEditors';

let angularModule = angular.module(name, []);

angularModule.value('dataSetTypes', [{
  name: 'raw',
  displayName: 'Raw'
}, {
  name: 'simpleHTTP',
  displayName: 'URL'
}, {
  name: 'websocket',
  displayName: 'Websocket'
}, {
  name: 'extendedHTTP',
  displayName: 'HTTP Config'
}, {
  name: 'transformed',
  displayName: 'Transform'
}]);

// needs to be a factory with factory methods for getting default values...
angularModule.factory('defaultDataSets', function() {
  let myFactory = {
    raw: {
      rawData: '{}'
    },
    simpleHTTP: {
      url: 'http://properurl.org/jsondata',
      poll: {
        enabled: false,
        intervalSec: 20
      }
    },websocket: {
      url: 'ws://websocket_address',
      bufferSize: 20 // what is the bufferSize for?
    },
    transformed: {
      parents: [],
      transformFunction: 'x => x',
      stateParams: {
        enabled: false,
        state: '{\n  initialValue: 17\n}'
      }
    },
    extendedHTTP: function(parentId) {
      return {
        parentId: parentId,
        poll: {
          enabled: false,
          intervalSec: 20
        }
      }
    }
  };
  return myFactory;
});

angularModule.directive('rawDataEditor', function() {
  return {
    templateUrl: rawDataEditorTemplateUrl
  }
}).directive('simpleHttpDataEditor', function() {
  return {
    templateUrl: simpleHTTPDataEditorTemplateUrl
  }
}).directive('websocketDataEditor', function() {
  return {
    templateUrl: websocketDataEditorTemplateUrl
  }
}).directive('transformedDataEditor', function() {
  return {
    templateUrl: transformedDataEditorTemplateUrl
  }
}).directive('extendedHttpDataEditor', function() {
  return {
    templateUrl: extendedHTTPDataEditorTemplateUrl
  }
});

export default angularModule;
