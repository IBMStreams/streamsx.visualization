let _  = require('underscore');

let RawData = require('./reactivedatafactory.js').RawData;

var exports = module.exports = {};

let Pipeline = class Pipeline {
  constructor() {
    this.reactiveDatasets = []; // array of ReactiveData
  }

  addReactiveData(reactiveData, index) {
    if (_.isUndefined(index)) this.reactiveDatasets.push(reactiveData);
    else this.reactiveDatasets.splice(index, 0, reactiveData);
    return reactiveData;
  }

  findReactiveData(datasetId) {
    let theRd = _.find(this.reactiveDatasets, (rd) => (rd._id === datasetId));
    if (! theRd) throw new Error('findReactiveData pipeline method called on non existent dataset id');
    return theRd;
  }

  removeReactiveData(datasetId) {
    let theRd = this.findReactiveData(datasetId);
    theRd.dispose();
    this.reactiveDatasets = this.reactiveDatasets.filter((rd) => (rd._id !== datasetId));
    return theRd;
  }

  changeReactiveData(newReactiveData) {
    let index = _.findIndex(this.reactiveDatasets, (ds) => (ds._id == newReactiveData._id));
    if (index < 0) throw new Error("could not find index in changeReactiveData");
    let theRd = this.removeReactiveData(newReactiveData._id);
    let rs = theRd.getReactiveStream();
    console.log('resetting reactive stream');
    newReactiveData.resetReactiveStream(rs);
    console.log('to', rs);
    let latest = this.addReactiveData(newReactiveData, 0);
  }

  makeReactiveData(dataset) {
    let self = this;
    switch (dataset.datasetType) {
      case "Raw": return new RawData(dataset._id, dataset.name, eval("(" + dataset.rawData + ")"));
      break;
      default: throw new Error('unknown datasetType in makeReactiveData');
    }
  }

  addDataset(dataset) {
    return this.addReactiveData(this.makeReactiveData(dataset));
  }

  removeDataset(datasetId) {
    return this.removeReactiveData(datasetId);
  }

  changeDataset(dataset) {
    console.log('changing reactive data');
    return this.changeReactiveData(this.makeReactiveData(dataset));
  }

}

// angular wrapper service for the pipeline
// const reactivePipeline = ['reactiveDataFactory', "leafletData", "leafletBoundsHelpers", function (reactiveDataFactory, leafletData, leafletBoundsHelpers) {
//   class ReactivePipeline extends Pipeline {
//     constructor() {
//       super();
//     }
//
//     addDataSet(dataSet) {
//       let self = this;
//       return this.addReactiveData(self.makeReactiveData(dataSet));
//     }
//
//     removeDataSet(dataSetId) {
//       return this.removeReactiveData(dataSetId);
//     }
//
//     changeDataSet(dataSet) {
//       let rd = this.makeReactiveData(dataSet);
//       return this.changeReactiveData(rd);
//     }
//
//     makeReactiveData(dataSet) {
//       let self = this;
//       switch (dataSet.dataSetType) {
//         case "raw": return reactiveDataFactory.rawData(dataSet._id, dataSet.name, eval("(" + dataSet.rawData + ")"));
//         break;
//         case "interval": return reactiveDataFactory.intervalData(dataSet._id, dataSet.name, dataSet.intervalMilliSec);
//         break;
//         case "websocket": return reactiveDataFactory.websocketData(dataSet._id, dataSet.name, dataSet.url);
//         break;
//         case "transformed": {
//           // get reactives
//           let reactiveDataArray = dataSet.parents.map(pid => {
//             let parent = _.find(self.reactiveDataSets, rd => (rd._id === pid));
//             if (! parent) throw new Error("Unable to find parent dataset in makeReactiveData");
//             return parent;
//           });
//           // eval the transformFunction
//           let transformFunction = undefined;
//           (function tfEval() {
//             let myModules = require('read-mymodules').myModules;
//             try {
//               transformFunction = eval("(" + dataSet.transformFunction + ")");
//               if (! _.isFunction(transformFunction)) throw new Error("Invalid transform function in makeReactiveData");
//             } catch (e) {
//               throw new Error("Transform function eval error in makeReactiveData: " + e.message);
//             }
//           })();
//
//           // eval the state
//           let state = undefined;
//           if (dataSet.stateParams.enabled) {
//             try {
//               state = eval("(" + dataSet.stateParams.state + ")");
//               if (_.isUndefined(state)) throw new Error("Undefined / invalid state in makeReactiveData");
//             } catch (e) {
//               throw new Error("State eval error in makeReactiveData: " + e.message);
//             }
//           }
//           // everything checks out; make reactive and return
//           let transformArgArray = [dataSet._id, dataSet.name, reactiveDataArray, transformFunction];
//           if (dataSet.stateParams.enabled) transformArgArray.push(state);
//           return reactiveDataFactory.transformedData(...transformArgArray);
//         }
//         break;
//         case "validated": {
//           let reactiveData = _.find(self.reactiveDataSets, ds => (ds._id === dataSet.parentId));
//           if (! reactiveData) throw new Error("Unable to find parent dataset in makeReativeData");
//           let jsonSchema = undefined;
//           try {
//             jsonSchema = eval("(" + dataSet.jsonSchema + ")");
//           } catch (e) {
//             throw new Error("schema creation error in makeReactiveData", e);
//           }
//           // everything checks out
//           return reactiveDataFactory.validatedData(dataSet._id, dataSet.name, reactiveData, jsonSchema);
//         }
//         break;
//         case "extendedHTTP": {
//           let reactiveData = _.find(self.reactiveDataSets, ds => (ds._id === dataSet.parentId));
//           if (! reactiveData) throw new Error("Unable to find parent dataset in makeReativeData");
//           let argArray = [dataSet._id, dataSet.name, reactiveData];
//           if (dataSet.poll.enabled) argArray.push(dataSet.poll.intervalMilliSec);
//           return reactiveDataFactory.extendedHTTPData(...argArray);
//         }
//         break;
//         case "simpleHTTP": {
//           let argArray = [dataSet._id, dataSet.name, dataSet.url];
//           if (dataSet.poll.enabled) argArray.push(dataSet.poll.intervalMilliSec);
//           return reactiveDataFactory.simpleHTTPData(...argArray);
//         }
//         break;
//         default: throw new Error('unknown dataSetType in makeReactiveData');
//       }
//     }
//   };
//
//   this.getInstance = () => (new ReactivePipeline());
// }];

exports.Pipeline = Pipeline;
