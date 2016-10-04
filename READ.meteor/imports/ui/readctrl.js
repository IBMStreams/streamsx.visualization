import _ from 'underscore';

/* read controller for root state */
import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataPanels} from '/imports/api/datapanels';
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
      self.subscribe('datapanels', () => [self.user.selectedIds.appId], {
        onReady: () => {
          readState.deferredDataPanels.resolve();
        }
      });
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
      if (_.contains(['NVD3'], template.pluginType)) {
        readState.deferredPlayground.promise.then(() => {
          readState.dependencies.addParents([template.inputSchemaId, template.basicOptionsSchemaId, template.canonicalSchemaId], template._id);
        });
      }
    },
    removed: (template) => {
      readState.dependencies.removeNode(template._id);
    },
    changed: (newTemplate, oldTemplate) => { // we can optimize later... // this has to be based on fields not all changes...
      if (_.contains(['NVD3'], newTemplate.pluginType)) {
        if (
          (newTemplate.inputSchemaId !== oldTemplate.inputSchemaId) ||
          (newTemplate.basicOptionsSchemaId !== oldTemplate.basicOptionsSchemaId) ||
          (newTemplate.canonicalSchemaId !== oldTemplate.canonicalSchemaId)
        )
        readState.dependencies.removeParents(newTemplate._id);
        // add all the 3 types of edges
        readState.dependencies.addParents([newTemplate.inputSchemaId, newTemplate.basicOptionsSchemaId, newTemplate.canonicalSchemaId], newTemplate._id);
      }
    }
  });

  let dataSetQuery = DataSets.find({});
  let dataSetQueryHandle = dataSetQuery.observe({
    added: (dataSet) => {
      readState.dependencies.addNode(dataSet._id);
      readState.pipeline.addDataSet(dataSet);
    },
    removed: (dataSet) => {
      readState.dependencies.removeNode(dataSet._id);
      readState.pipeline.removeDataSet(dataSet._id);
    },
    changed: (newDataSet, oldDataSet) => { // we can optimize later... // this has to be based on fields not all changes...
      if (! _.contains(['raw', 'simpleHTTP'], newDataSet.dataSetType))
      throw new Error('only raw and simpleHTTP dataset changes handled at the moment');
      else {
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
        changeVisualizationParents(visualization);
      }
    }
  });

}];
