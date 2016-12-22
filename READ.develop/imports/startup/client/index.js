import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMessages from 'angular-messages';
import uiAce from 'angular-ui-ace';
import angularSanitize from 'angular-sanitize';
import angularUi from 'angular-ui-bootstrap';
import clipBoard from 'clipboard';
import ngClipBoard from 'ngclipboard/dist/ngclipboard';
import sortable from 'angular-ui-sortable/dist/sortable';

import d3 from 'd3';

import 'nvd3/build/nv.d3.js';
import 'angular-nvd3/dist/angular-nvd3';
import 'nvd3/build/nv.d3.css';

import 'leaflet/dist/leaflet';
import angularLeafletDirective from 'angular-leaflet-directive/dist/angular-leaflet-directive';
import 'drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js';
import 'leaflet/dist/leaflet.css';

// import {reactiveDataFactory} from 'read-common/imports/api/client/reactivedatafactory.js';
// import {reactivePipeline} from 'read-common/imports/api/client/reactivepipeline';
import {readStateFactory} from '/imports/api/client/readstatefactory.js';
import {readCtrl} from '/imports/ui/readctrl.js';

import {validJsonDirective, validObjectDirective, validStateObjectDirective, validFunctionDirective} from '/imports/ui/partials/aceoptions';
import {dimensionsDirective} from 'read-common/imports/ui/partials/dimensions';

import {headerNavComponent} from '/imports/ui/partials/common/headernav/headernav';
import {sideNavComponent} from '/imports/ui/partials/common/sidenav/sidenav';
import sideNavWrapperTemplateUrl from '/imports/ui/partials/common/sidenav/sidenavwrapper.html';
import {dashboardComponent} from '/imports/ui/partials/dashboard/dashboard';

import developerHomeTemplateUrl from '/imports/ui/pages/developer/home/home.html';

// import {appSideNavCtrl} from '/imports/ui/pages/developer/app/dashboard/app/sidenav.js';
// import appMainContentTemplateUrl from '/imports/ui/pages/developer/app/dashboard/app/maincontent.html';
// import {appCtrl} from '/imports/ui/pages/developer/app/dashboard/app/maincontent.js';

// import '/imports/ui/pages/developer/app/dashboard/dataset/dataseteditors';
import '/imports/ui/pages/developer/playground/dataset/dataseteditors';

// import dashboardSideNavTemplateUrl from '/imports/ui/pages/developer/app/dashboard/sidenav.html';
// import {dashboardSideNavCtrl} from '/imports/ui/pages/developer/app/dashboard/sidenav.js';
// import dashboardMainContentTemplateUrl from '/imports/ui/pages/developer/app/dashboard/maincontent.html';
// import {dashboardMainContentCtrl} from '/imports/ui/pages/developer/app/dashboard/maincontent.js';
//
// import {dashboardDashboardSideNavCtrl} from '/imports/ui/pages/developer/app/dashboard/dashboard/sidenav';
// import dashboardDashboardMainContentTemplateUrl from '/imports/ui/pages/developer/app/dashboard/dashboard/dashboard.html';
// import {dashboardDashboardCtrl} from '/imports/ui/pages/developer/app/dashboard/dashboard/dashboard';
//
// import {dashboardDesignerSideNavCtrl} from '/imports/ui/pages/developer/app/dashboard/designer/sidenav';
// import dashboardDesignerMainContentTemplateUrl from '/imports/ui/pages/developer/app/dashboard/designer/designer.html';
// import {dashboardDesignerCtrl} from '/imports/ui/pages/developer/app/dashboard/designer/designer';
// import {nvd3VizDesignCtrl} from '/imports/ui/pages/developer/app/dashboard/designer/nvd3designer';
// import {leafletVizDesignCtrl} from '/imports/ui/pages/developer/app/dashboard/designer/leafletdesigner';
//
// import {dashboardDataSetSideNavCtrl} from '/imports/ui/pages/developer/app/dashboard/dataset/sidenav';
// import dashboardDataSetMainContentTemplateUrl from '/imports/ui/pages/developer/app/dashboard/dataset/dataset.html';
// import {dashboardDataSetCtrl} from '/imports/ui/pages/developer/app/dashboard/dataset/dataset';

import playgroundMainContentTemplateUrl from '/imports/ui/pages/developer/playground/maincontent.html';
import {playgroundMainContentCtrl} from '/imports/ui/pages/developer/playground/maincontent.js';
import playgroundDatasetMainContentTemplateUrl from '/imports/ui/pages/developer/playground/dataset/maincontent.html';
import {playgroundDatasetCtrl} from '/imports/ui/pages/developer/playground/dataset/maincontent.js';

import pluginSideNavTemplateUrl from '/imports/ui/pages/developer/playground/plugin/sidenav.html';
import {pluginSideNavCtrl} from '/imports/ui/pages/developer/playground/plugin/sidenav.js';
import pluginMainContentTemplateUrl from '/imports/ui/pages/developer/playground/plugin/maincontent.html';
import {pluginMainContentCtrl} from '/imports/ui/pages/developer/playground/plugin/maincontent.js';

import playgroundDatasetSideNavTemplateUrl from '/imports/ui/pages/developer/playground/dataset/sidenav.html';
import {playgroundDatasetSideNavCtrl} from '/imports/ui/pages/developer/playground/dataset/sidenav.js';

import chartTemplateSideNavTemplateUrl from '/imports/ui/pages/developer/playground/charttemplate/sidenav.html';
import {chartTemplateSideNavCtrl} from '/imports/ui/pages/developer/playground/charttemplate/sidenav.js';

// import {nvd3ProviderComponent} from '/imports/ui/partials/visualizations/nvd3/nvd3provider';
// import {leafletProviderComponent, leafletMapDirective} from '/imports/ui/partials/visualizations/leaflet/leafletprovider';
//
// import {visualizationComponent} from '/imports/ui/partials/visualizations/visualization';
// import {nvd3VisualizationComponent} from '/imports/ui/partials/visualizations/nvd3/nvd3visualization';
// import {leafletVisualizationComponent} from '/imports/ui/partials/visualizations/leaflet/leafletvisualization';

import tutorialSideNavTemplateUrl from '/imports/ui/pages/docs/tutorial/sidenav.html';
import {tutorialSideNavCtrl} from '/imports/ui/pages/docs/tutorial/sidenav';
import tutorialMainContentTemplateUrl from '/imports/ui/pages/docs/tutorial/maincontent.html';
import {tutorialMainContentCtrl} from '/imports/ui/pages/docs/tutorial/maincontent';

let name = 'read';

let angularModule = angular.module(name, [angularMeteor, uiRouter, ngMessages,
  'ui.bootstrap', 'ngSanitize', 'ui.ace', 'nvd3', 'ngclipboard',
  'read.dataset', 'leaflet-directive', 'ui.sortable']);

angularModule
// .factory('reactiveDataFactory', reactiveDataFactory)
// .service('reactivePipeline', reactivePipeline)
.factory('readState', readStateFactory)
.directive('validJson', validJsonDirective)
.directive('validObject', validObjectDirective)
.directive('validStateObject', validStateObjectDirective)
.directive('validFunction', validFunctionDirective)
.directive('dimensions', dimensionsDirective)
.component('headerNav', headerNavComponent)
.component('sideNav', sideNavComponent)
// .component('nvd3Provider', nvd3ProviderComponent)
// .directive('leafletMap', leafletMapDirective)
// .component('leafletProvider', leafletProviderComponent)
// .component('visualization', visualizationComponent)
// .component('nvd3Visualization', nvd3VisualizationComponent)
// .component('leafletVisualization', leafletVisualizationComponent)
// .component('dashboard', dashboardComponent)
.controller('readCtrl', readCtrl)
// .controller('appCtrl', appCtrl)
// .controller('dataSetCtrl', dashboardDataSetCtrl)
// .controller('dashboardCtrl', dashboardDashboardCtrl)
// .controller('designerCtrl', dashboardDesignerCtrl)
// .controller('nvd3VizDesignCtrl', nvd3VizDesignCtrl)
// .controller('leafletVizDesignCtrl', leafletVizDesignCtrl)
.controller('pluginCtrl', pluginMainContentCtrl)
.controller('playgroundDatasetCtrl', playgroundDatasetCtrl);

angularModule.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

  // For any unmatched url, send to /home
  $urlRouterProvider.otherwise("/developer/home");

  $stateProvider
  .state('read', {
    abstract: true
  })
  .state('read.developer', {
    abstract: true,
    resolve: {
      deferredUser: ['readState', (readState) => readState.deferredUser.promise],
      // deferredApps: ['readState', (readState) => readState.deferredApps.promise],
      deferredPlugins: ['readState', (readState) => readState.deferredPlugins.promise],
      deferredPlaygroundDatasets: ['readState', (readState) => readState.deferredPlaygroundDatasets.promise],
      deferredChartTemplates: ['readState', (readState) => readState.deferredChartTemplates.promise],
      // deferredPlayground: ['readState', (readState) => readState.deferredPlayground.promise],
      // deferredDataSets: ['readState', (readState) => readState.deferredDataSets.promise],
      // deferredDashboards: ['readState', (readState) => readState.deferredDashboards.promise],
      // deferredVisualizations: ['readState', (readState) => readState.deferredVisualizations.promise],
    }
  })
  .state('read.developer.home', {
    url: "/developer/home",
    views: {
      'maincontent@': {
        templateUrl: developerHomeTemplateUrl
      }
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.notPresent();
    }]
  })
  // .state('read.developer.app', {
  //   abstract: true
  // })
  // .state('read.developer.app.dashboard', {
  //   url: "/developer/app/dashboard",
  //   views: {
  //     'sidenav@': {
  //       templateUrl: dashboardSideNavTemplateUrl,
  //       controller: dashboardSideNavCtrl,
  //       controllerAs: 'dashboardSideNavCtrl'
  //     },
  //     'maincontent@': {
  //       templateUrl: dashboardMainContentTemplateUrl,
  //       controller: dashboardMainContentCtrl,
  //       controllerAs: 'dashboardMainContentCtrl'
  //     }
  //   },
  //   abstract: true,
  //   onEnter: ['readState', function(readState) {
  //     readState.sidebar.isPresent();
  //   }]
  // })
  // .state('read.developer.app.dashboard.app', {
  //   url: "/app",
  //   views: {
  //     'side': {
  //       templateUrl: sideNavWrapperTemplateUrl,
  //       controller: appSideNavCtrl,
  //       controllerAs: 'sideNavCtrl'
  //     },
  //     'main': {
  //       templateUrl: appMainContentTemplateUrl
  //     }
  //   },
  //   onEnter: ['readState', function(readState) {
  //     readState.mainContentSelectedTab.dashboard = 'app';
  //   }]
  // })
  // .state('read.developer.app.dashboard.dashboard', {
  //   url: "/dashboard",
  //   views: {
  //     'side': {
  //       templateUrl: sideNavWrapperTemplateUrl,
  //       controller: dashboardDashboardSideNavCtrl,
  //       controllerAs: 'sideNavCtrl'
  //     },
  //     'main': {
  //       templateUrl: dashboardDashboardMainContentTemplateUrl
  //     }
  //   },
  //   onEnter: ['readState', function(readState) {
  //     readState.mainContentSelectedTab.dashboard = 'dashboard';
  //   }]
  // })
  // .state('read.developer.app.dashboard.designer', {
  //   url: "/designer",
  //   views: {
  //     'side': {
  //       templateUrl: sideNavWrapperTemplateUrl,
  //       controller: dashboardDesignerSideNavCtrl,
  //       controllerAs: 'sideNavCtrl'
  //     },
  //     'main': {
  //       templateUrl: dashboardDesignerMainContentTemplateUrl
  //     }
  //   },
  //   onEnter: ['readState', function(readState) {
  //     readState.mainContentSelectedTab.dashboard = 'designer';
  //   }]
  // })
  // .state('read.developer.app.dashboard.dataset', {
  //   url: "/dataset",
  //   views: {
  //     'side': {
  //       templateUrl: sideNavWrapperTemplateUrl,
  //       controller: dashboardDataSetSideNavCtrl,
  //       controllerAs: 'sideNavCtrl'
  //     },
  //     'main': {
  //       templateUrl: dashboardDataSetMainContentTemplateUrl
  //     }
  //   },
  //   onEnter: ['readState', function(readState) {
  //     readState.mainContentSelectedTab.dashboard = 'dataset';
  //   }]
  // })
  .state('read.developer.playground', {
    url: "/developer/playground",
    views: {
      'maincontent@': {
        templateUrl: playgroundMainContentTemplateUrl,
        controller: playgroundMainContentCtrl,
        controllerAs: 'playgroundCtrl'
      }
    },
    abstract: true,
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground.plugin', {
    url: "/plugin?index",
    views: {
      'sidenav@': {
        templateUrl: pluginSideNavTemplateUrl,
        controller: pluginSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'main': {
        templateUrl: pluginMainContentTemplateUrl
      }
    }
  })
  .state('read.developer.playground.dataset', {
    url: "/dataset?index",
    views: {
      'sidenav@': {
        templateUrl: playgroundDatasetSideNavTemplateUrl,
        controller: playgroundDatasetSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'main': {
        templateUrl: playgroundDatasetMainContentTemplateUrl
      }
    }
  })
  .state('read.developer.playground.charttemplate', {
    url: "/charttemplate?pluginIndex&chartTemplateIndex",
    views: {
      'sidenav@': {
        templateUrl: chartTemplateSideNavTemplateUrl,
        controller: chartTemplateSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      // 'main': {
      //   templateUrl: pluginMainContentTemplateUrl,
      //   controller: pluginMainContentCtrl,
      //   controllerAs: 'mainContentCtrl'
      // }
    }
  })
  .state('read.docs', {
    abstract: true
  })
  .state('read.docs.gettingstarted', {
    url: "/docs/gettingstarted",
    onEnter: ['readState', function(readState) {
      readState.sidebar.notPresent();
    }]
  })
  .state('read.docs.tutorial', {
    url: "/docs/tutorial",
    views: {
      'sidenav@': {
        templateUrl: tutorialSideNavTemplateUrl,
        controller: tutorialSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'maincontent@': {
        templateUrl: tutorialMainContentTemplateUrl,
        controller: tutorialMainContentCtrl,
        controllerAs: 'mainContentCtrl'
      }
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  });
}]);

export default angularModule;
