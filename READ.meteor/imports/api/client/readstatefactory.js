/* read.state angular factory -
This contains models / state that is shared across views and view controllers */
import {Dependency} from '/imports/api/client/dependency';

export const readStateFactory = ['$q', 'reactivePipeline', ($q, reactivePipelineService) => {
  let myFactory = {
    sidebar: {
      present: true,
      show: true,
      tutorial: 'createApp'
    },
    mainContentSelectedTab: {
      dataSet: 'editor',
      designer: 'data',
      dataSchema: 'schema',
      nvd3: 'data',
      leaflet: 'data',
      tutorial: 'timeseries'
    },
    deferredUser: $q.defer(),
    deferredApps: $q.defer(),
    deferredDashboards: $q.defer(),
    deferredPlayground: $q.defer(),
    deferredDataSets: $q.defer(),
    deferredVisualizations: $q.defer(),
    dependencies: new Dependency(),
    pipeline: reactivePipelineService.getInstance(),
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
