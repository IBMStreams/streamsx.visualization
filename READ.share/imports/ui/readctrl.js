import _ from 'underscore/underscore';
import toposort from 'toposort';

/* read controller for root state */
import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {DataSets} from '/imports/api/datasets';
import {Playground} from '/imports/api/playground';
import {Dashboards} from '/imports/api/dashboards';
import {Visualizations} from '/imports/api/visualizations';

export const readCtrl = ['$scope', '$reactive', 'readState', '$location',
function ($scope, $reactive, readState, $location) {
  $reactive(this).attach($scope);
  $scope.readState = readState;
  let self = this;

  this.subscribe('users', null, {
    onReady: () => {
      readState.deferredUser.resolve();
    }
  });

  readState.app._id = $location.path().trim().replace(/\/$/, "").replace(/^\/app\//, "")

  this.subscribe('apps', () => [readState.app._id], {
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
    user: () => Users.findOne({}),
  });

  this.subscribe('dashboards', () => [readState.app._id], {
    onReady: () => {
      readState.deferredDashboards.resolve();
    }
  });

  let changeDataSetParents = (dataSet) => {
    if (! _.contains(['extendedHTTP', 'transformed'], dataSet.dataSetType))
    throw new Error('only extendedHTTP and transformed datasets can have parents');
    readState.dependencies.removeParents(dataSet._id);
    if (dataSet.dataSetType === 'transformed') readState.dependencies.addParents(dataSet.parents, dataSet._id);
    else if (dataSet.dataSetType === 'extendedHTTP') readState.dependencies.addParents([dataSet.parentId], dataSet._id);
  };

  this.subscribe('datasets', () => [readState.app._id], {
    onReady: () => {
      let dataSets = DataSets.find({appId: readState.app._id}).fetch();
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
  });

  this.subscribe('visualizations', () => [readState.app._id], {
    onReady: () => {
      readState.deferredVisualizations.resolve();
    }
  });

  let dataSetQuery = DataSets.find({});

  let dataSetQueryHandle = dataSetQuery.observe({
    added: (dataSet) => {
      readState.deferredDataSets.promise.then(() => {
        // if you cannot find dataset in readState.dependencies... you gotta do all the work here...
        if (readState.dependencies.findNode(dataSet._id).length === 0) {
          readState.dependencies.addNode(dataSet._id);
          if (_.contains(['extendedHTTP', 'transformed'], dataSet.dataSetType)) {
            throw new Error('extendedHTTP and transformed datasets cannot be added directly');
          };
          readState.pipeline.addDataSet(dataSet);
        }
      });
    },
    removed: (dataSet) => {
      readState.dependencies.removeNode(dataSet._id);
      readState.pipeline.removeDataSet(dataSet._id);
    },
    changed: (newDataSet, oldDataSet) => { // we can optimize later... // this has to be based on fields not all changes...
      if (! _.contains(['raw', 'simpleHTTP', 'extendedHTTP', 'transformed'], newDataSet.dataSetType))
      throw new Error('only raw, simpleHTTP, extendedHTTP, and transformed dataset changes handled at the moment');
      else {
        if (_.contains(['extendedHTTP', 'transformed'], oldDataSet.dataSetType)) readState.dependencies.removeParents(oldDataSet._id);
        if (_.contains(['extendedHTTP', 'transformed'], newDataSet.dataSetType)) changeDataSetParents(newDataSet);
        readState.pipeline.changeDataSet(newDataSet);
      }
    }
  });

  readState.deferredApps.promise.then(function() {
    readState.deferredDashboards.promise.then(function() {
      let db = Dashboards.findOne({appId: readState.app._id});
      readState.app.selectedDashboardId = (db ? db._id : undefined);
      readState.app.name = Apps.findOne({_id: readState.app._id}).name;
      readState.app.selectedDashboardName = db.name;
    });
  });

}];
