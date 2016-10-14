import _ from 'underscore/underscore';

/* read controller for root state */
import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';

export const readCtrl = ['$scope', '$reactive', 'readState',
function ($scope, $reactive, readState) {
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

  this.subscribe('playground', null, {
    onReady: () => {
      readState.deferredPlayground.resolve();
    }
  });

  this.helpers({
    user: () => Users.findOne({})
  });

  this.autorun((c) => {
    if (self.getReactively('user', true)) {
      self.subscribe('dashboards', () => [self.user.selectedIds.appId], {
        onReady: () => {
          readState.deferredDashboards.resolve();
        }
      });
    }
  });

  this.subscribe('datasets', () => [self.getReactively('user.selectedIds.appId')], {
    onReady: () => {
      readState.deferredDataSets.resolve();
    }
  });

  this.subscribe('visualizations', () => [self.getReactively('user.selectedIds.appId')], {
    onReady: () => {
      readState.deferredVisualizations.resolve();
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

  let dataSetQuery = DataSets.find({});
  let dataSetQueryHandle = dataSetQuery.observe({
    added: (dataSet) => {
      readState.dependencies.addNode(dataSet._id);
      if (dataSet.dataSetType === 'transformed') readState.dependencies.addParents(dataSet.parents, dataSet._id);
      readState.pipeline.addDataSet(dataSet);
    },
    removed: (dataSet) => {
      readState.dependencies.removeNode(dataSet._id);
      readState.pipeline.removeDataSet(dataSet._id);
    },
    changed: (newDataSet, oldDataSet) => { // we can optimize later... // this has to be based on fields not all changes...
      if (! _.contains(['raw', 'simpleHTTP', 'extendedHTTP', 'transformed'], newDataSet.dataSetType))
      throw new Error('only raw, simpleHTTP, extendedHTTP, and transformed dataset changes handled at the moment');
      else {
        if (oldDataSet.dataSetType === 'transformed') readState.dependencies.removeParents(oldDataSet._id);
        if (newDataSet.dataSetType === 'transformed') readState.dependencies.addParents(newDataSet.parents, newDataSet._id);
        readState.pipeline.changeDataSet(newDataSet);
      }
    }
  });

  let changeVisualizationParents = (visualization) => {
    readState.dependencies.removeParents(visualization._id);
    readState.dependencies.addParents([visualization.dataSetId, visualization.templateId], visualization._id);
  };

  let visualizationQuery = Visualizations.find({});
  let visualizationQueryHandle = visualizationQuery.observe({
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
