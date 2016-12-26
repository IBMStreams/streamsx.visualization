/* read.state angular factory -
This contains models / state that is shared across views and view controllers */
import {Dependency} from 'read-common/imports/api/client/dependency';
import {Pipeline} from 'read-common/imports/api/client/reactivepipeline'

export const readStateFactory = ['$q', ($q) => {
  let myFactory = {
    sidebar: {
      present: true,
      show: true,
      tutorial: 'createApp',
      helpTopics: 'dashboardSharing'
    },
    playground: {
      dataset: 'editor',
      chartTemplate: 'dataHandlers'
    },
    mainContentSelectedTab: {
      dataSet: 'editor',
      designer: {
        nvd3: 'basicOptions',
        leaflet: 'basicOptions'
      },
      dataSchema: 'schema',
      nvd3: 'data',
      leaflet: 'data',
      tutorial: 'timeseries'
    },
    deferredUser: $q.defer(),
    // deferredPlayground: $q.defer(),
    // deferredApps: $q.defer(),
    // deferredDashboards: $q.defer(),
    // deferredDataSets: $q.defer(),
    // deferredVisualizations: $q.defer(),
    deferredPlugins: $q.defer(),
    deferredPlaygroundDatasets: $q.defer(),
    deferredChartTemplates: $q.defer(),
    dependencies: new Dependency(),
    pipeline: new Pipeline(),
  };

  myFactory.sidebar.isPresent = () => {
    myFactory.sidebar.present = true;
  };

  myFactory.sidebar.notPresent = () => {
    myFactory.sidebar.present = false;
  };

  myFactory.sidebar.toggle = () => {
    myFactory.sidebar.show = ! myFactory.sidebar.show;
  };

  return myFactory;
}];
