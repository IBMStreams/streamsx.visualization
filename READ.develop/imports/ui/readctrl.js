import _ from 'underscore/underscore';
import toposort from 'toposort';

/* read controller for root state */
import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';

export const readCtrl = ['$scope', '$reactive', 'readState', '$timeout',
function ($scope, $reactive, readState, $timeout) {
  $reactive(this).attach($scope);
  $scope.readState = readState;
  let self = this;

  this.subscribe('users', null, {
    onReady: () => {
      readState.deferredUser.resolve();
    }
  });

  this.subscribe('apps', null, {
    onReady: () => {
      readState.deferredApps.resolve();
    }
  });

  this.subscribe('plugins', null, {
    onReady: () => {
      readState.deferredPlugins.resolve();
    }
  });

  this.subscribe('playgrounddatasets', null, {
    onReady: () => {
      readState.deferredPlaygroundDatasets.resolve();
    }
  });

  this.subscribe('playground', null, {
    onReady: () => {
      readState.deferredPlayground.resolve();
    }
  });


  let changeDataSetParents = (dataSet) => {
    if (! _.contains(['extendedHTTP', 'transformed'], dataSet.dataSetType))
    throw new Error('only extendedHTTP and transformed datasets can have parents');
    readState.dependencies.removeParents(dataSet._id);
    if (dataSet.dataSetType === 'transformed') readState.dependencies.addParents(dataSet.parents, dataSet._id);
    else if (dataSet.dataSetType === 'extendedHTTP') readState.dependencies.addParents([dataSet.parentId], dataSet._id);
  };

  this.helpers({
    user: () => Users.findOne({}),
    reactiveFetches: () => {
      if (self.getReactively('user.selectedIds.appId')) {
        readState.deferredUser.promise.then(() => {
          readState.deferredPlayground.promise.then(() => {
            readState.deferredApps.promise.then(() => {
              self.subscribe('dashboards', () => [self.getReactively('user.selectedIds.appId')], {
                onReady: () => {
                  readState.deferredDashboards.resolve();
                }
              });

              let finishedDataSetOnReady = false;
              self.subscribe('datasets', () => {
                return [self.getReactively('user.selectedIds.appId')]
              }, {
                onReady: () => {
                  if (! finishedDataSetOnReady) {
                    let dataSets = DataSets.find({appId: self.getReactively('user.selectedIds.appId')}).fetch();
                    dataSets.map(dataSet => {
                      readState.dependencies.addNode(dataSet._id);
                    });
                    dataSets.map(dataSet => {
                      if (_.contains(['extendedHTTP', 'transformed'], dataSet.dataSetType)) {
                        changeDataSetParents(dataSet);
                      };
                    });
                    //toposort
                    let nodes = dataSets.map(d => d._id);
                    let edges = readState.dependencies.graph.elements().edges().map(e => e.data()).map(o => [o.source, o.target]);
                    toposort.array(nodes, edges).map(_id => {
                      readState.pipeline.addDataSet(_.find(dataSets, ds => ds._id === _id));
                    });
                    // finally resolve
                    readState.deferredDataSets.resolve();
                  }
                  finishedDataSetOnReady = true;
                }
              });

              self.subscribe('visualizations', () => [self.getReactively('user.selectedIds.appId')], {
                onReady: () => {
                  readState.deferredVisualizations.resolve();
                }
              });
            });
          });
        });
      }
      return;
    }
  });

  let playgroundQuery = Playground.find({});
  let playgroundQueryObserveHandle = playgroundQuery.observe({
    added: (template) => {
      readState.dependencies.addNode(template._id);
      if (template.pluginType === 'NVD3') {
        readState.deferredPlayground.promise.then(() => {
          readState.dependencies.addParents([template.inputSchemaId, template.basicOptionsSchemaId, template.canonicalSchemaId], template._id);
        });
      } else if (template.pluginType === 'leaflet') {
        readState.deferredPlayground.promise.then(() => {
          readState.dependencies.addParents([template.inputSchemaId], template._id);
        });
      }
    },
    removed: (template) => {
      readState.dependencies.removeNode(template._id);
    },
    changed: (newTemplate, oldTemplate) => { // we can optimize later... // this has to be based on fields not all changes...
      readState.dependencies.removeParents(newTemplate._id);
      if (newTemplate.pluginType === 'NVD3') {
        readState.deferredPlayground.promise.then(() => {
          readState.dependencies.addParents([newTemplate.inputSchemaId, newTemplate.basicOptionsSchemaId, newTemplate.canonicalSchemaId], newTemplate._id);
        });
      } else if (newTemplate.pluginType === 'leaflet') {
        readState.deferredPlayground.promise.then(() => {
          readState.dependencies.addParents([newTemplate.inputSchemaId], newTemplate._id);
        });
      }
    }
  });

  DataSets.find().observe({
    added: (dataSet) => {
        readState.deferredDataSets.promise.then(() => {
          // if you cannot find dataset in readState.dependencies... you gotta do all the work here...
          if (readState.dependencies.findNode(dataSet._id).length === 0) {
            readState.dependencies.addNode(dataSet._id);
            readState.pipeline.addDataSet(dataSet);
          }
        });
    },
    removed: (dataSet) => {
        readState.dependencies.removeNode(dataSet._id);
        readState.pipeline.removeDataSet(dataSet._id);
    },
    changed: (newDataSet, oldDataSet) => { // we can optimize later... // this has to be based on fields not all changes...
      if (! _.contains(['raw', 'websocket','simpleHTTP', 'extendedHTTP', 'transformed'], newDataSet.dataSetType))
      throw new Error('only raw, simpleHTTP, extendedHTTP, and transformed dataset changes handled at the moment');
      else {
        if (_.contains(['extendedHTTP', 'transformed'], oldDataSet.dataSetType)) readState.dependencies.removeParents(oldDataSet._id);
        if (_.contains(['extendedHTTP', 'transformed'], newDataSet.dataSetType)) changeDataSetParents(newDataSet);
        readState.pipeline.changeDataSet(newDataSet);
      }
    }
  });

  let changeVisualizationParents = (visualization) => {
    readState.dependencies.removeParents(visualization._id);
    readState.dependencies.addParents([visualization.dataSetId, visualization.templateId], visualization._id);
  };

  Visualizations.find().observe({
    added: (visualization) => {
      readState.dependencies.addNode(visualization._id);
      readState.deferredVisualizations.promise.then(() => {
        readState.deferredDataSets.promise.then(() => {
          readState.deferredPlayground.promise.then(() => { // everything is ready now...
            changeVisualizationParents(visualization);
          });
        });
      });
    },
    removed: (visualization) => {
      readState.dependencies.removeNode(visualization._id);
    },
    changed: (newVisualization, oldVisualization) => {
      // templates and dataSets are both initialized by now
      // if parents have changed
      if ((newVisualization.dataSetId !== oldVisualization.dataSetId) ||
      (newVisualization.templateId !== oldVisualization.templateId)) {
        changeVisualizationParents(newVisualization);
      }
    }
  });

}];
