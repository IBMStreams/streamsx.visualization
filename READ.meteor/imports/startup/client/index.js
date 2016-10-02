import angular from 'angular';
import angularMeteor from 'angular-meteor';
import rxAngular from 'rx-angular';
import uiRouter from 'angular-ui-router';
import ngMessages from 'angular-messages';
import uiAce from 'angular-ui-ace';
import angularSanitize from 'angular-sanitize';
import angularUi from 'angular-ui-bootstrap';
import clipBoard from 'clipboard';
import ngClipBoard from 'ngClipBoard/dist/ngclipboard';

import d3 from 'd3';
import nv from 'nvd3';
import 'nvd3/build/nv.d3.css';
import nvd3 from 'angular-nvd3';

import {reactiveDataFactory} from '/imports/api/client/reactivedatafactory.js';
import {reactivePipeline} from '/imports/api/client/reactivepipeline';
import {readStateFactory} from '/imports/api/client/readstatefactory.js';
import {readCtrl} from '/imports/ui/readctrl.js';
import {dataSetCtrl} from '/imports/ui/pages/developer/app/datapanel/dataset';
import {vizDesignCtrl} from '/imports/ui/pages/developer/app/dashboard/designer';
import {dashboardCtrl} from '/imports/ui/pages/developer/app/dashboard/dashboard';

import {validJsonDirective, validObjectDirective, validFunctionDirective} from '/imports/ui/partials/aceoptions';
import {dimensionsDirective} from '/imports/ui/partials/dimensions';

import {headerNavComponent} from '/imports/ui/partials/common/headernav/headernav';
import {sideNavComponent} from '/imports/ui/partials/common/sidenav/sidenav';
import sideNavWrapperTemplateUrl from '/imports/ui/partials/common/sidenav/sidenavwrapper.html';
import {dashboardComponent} from '/imports/ui/partials/dashboard/dashboard';

import developerHomeTemplateUrl from '/imports/ui/pages/developer/home/home.html';

import dasSideNavCtrl from '/imports/ui/pages/developer/app/share/sidenav.js';
import dasMainContentTemplateUrl from '/imports/ui/pages/developer/app/share/maincontent.html';
import dasMainContentCtrl from '/imports/ui/pages/developer/app/share/maincontent.js';

import schemaSideNavCtrl from '/imports/ui/pages/developer/playground/dataschema/sidenav.js';
import schemaMainContentTemplateUrl from '/imports/ui/pages/developer/playground/dataschema/maincontent.html';
import schemaMainContentCtrl from '/imports/ui/pages/developer/playground/dataschema/maincontent.js';

import dataPanelSideNavTemplate from '/imports/ui/pages/developer/app/datapanel/sidenav.html';
import dataPanelSideNavCtrl from '/imports/ui/pages/developer/app/datapanel/sidenav';
import dataPanelMainContentTemplateUrl from '/imports/ui/pages/developer/app/datapanel/maincontent.html';
import dataPanelMainContentCtrl from '/imports/ui/pages/developer/app/datapanel/maincontent.js';
import dataSetCreatorTemplateUrl from '/imports/ui/pages/developer/app/datapanel/creator.html';
import dataSetEditorTemplateUrl from '/imports/ui/pages/developer/app/datapanel/editor.html';
import dataSetViewerTemplateUrl from '/imports/ui/pages/developer/app/datapanel/viewer.html';
import '/imports/ui/pages/developer/app/datapanel/dataseteditors';

import dashboardSideNavTemplateUrl from '/imports/ui/pages/developer/app/dashboard/sidenav.html';
import dashboardSideNavCtrl from '/imports/ui/pages/developer/app/dashboard/sidenav.js';
import dashboardMainContentTemplateUrl from '/imports/ui/pages/developer/app/dashboard/maincontent.html';
import dashboardMainContentCtrl from '/imports/ui/pages/developer/app/dashboard/maincontent.js';
import dashboardDesignerTemplateUrl from '/imports/ui/pages/developer/app/dashboard/designer.html';
import dashboardViewerTemplateUrl from '/imports/ui/pages/developer/app/dashboard/dashboard.html';

import nvd3SideNavCtrl from '/imports/ui/pages/developer/playground/viz/nvd3/sidenav.js';
import nvd3MainContentTemplateUrl from '/imports/ui/pages/developer/playground/viz/nvd3/maincontent.html';
import nvd3MainContentCtrl from '/imports/ui/pages/developer/playground/viz/nvd3/maincontent.js';
import {nvd3ProviderComponent} from '/imports/ui/partials/visualizations/nvd3/nvd3provider';
import {visualizationComponent} from '/imports/ui/partials/visualizations/visualization';

import tutorialSideNavTemplateUrl from '/imports/ui/pages/docs/tutorial/sidenav.html';
import tutorialMainContentTemplateUrl from '/imports/ui/pages/docs/tutorial/maincontent.html';
import tutorialMainContentCtrl from '/imports/ui/pages/docs/tutorial/maincontent';

let name = 'read';

let angularModule = angular.module(name, [angularMeteor, uiRouter, ngMessages,
  'ui.bootstrap', 'ngSanitize', 'rx', 'ui.ace', 'nvd3', 'ngclipboard', 'read.dataSetEditors']);

angularModule.factory('reactiveDataFactory', reactiveDataFactory)
.service('reactivePipeline', reactivePipeline)
.factory('readState', readStateFactory)
.directive('validJson', validJsonDirective)
.directive('validObject', validObjectDirective)
.directive('validFunction', validFunctionDirective)
.directive('dimensions', dimensionsDirective)
.component('headerNav', headerNavComponent)
.component('sideNav', sideNavComponent)
.component('nvd3Provider', nvd3ProviderComponent)
.component('visualization', visualizationComponent)
.component('dashboard', dashboardComponent)
.controller('readCtrl', readCtrl)
.controller('dataSetCtrl', dataSetCtrl)
.controller('vizDesignCtrl', vizDesignCtrl)
.controller('dashboardCtrl', dashboardCtrl)

angularModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // All of the these routes need to configured based on settings... we will get to this at some point

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
      deferredApps: ['readState', (readState) => readState.deferredApps.promise],
      deferredPlayground: ['readState', (readState) => readState.deferredPlayground.promise],
      deferredDataPanels: ['readState', (readState) => readState.deferredDataPanels.promise],
      deferredDataSets: ['readState', (readState) => readState.deferredDataSets.promise],
      deferredDashboards: ['readState', (readState) => readState.deferredDashboards.promise],
      deferredVisualizations: ['readState', (readState) => readState.deferredVisualizations.promise],
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
  .state('read.developer.app', {
    abstract: true
  })
  .state('read.developer.app.datapanel', {
    url: "/developer/app/datapanel",
    views: {
      'sidenav@': {
        templateUrl: dataPanelSideNavTemplate,
        controller: dataPanelSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'maincontent@': {
        templateUrl: dataPanelMainContentTemplateUrl,
        controller: dataPanelMainContentCtrl,
        controllerAs: 'mainContentCtrl'
      }
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.app.dashboard', {
    url: "/developer/app/dashboard",
    views: {
      'sidenav@': {
        templateUrl: dashboardSideNavTemplateUrl,
        controller: dashboardSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'maincontent@': {
        templateUrl: dashboardMainContentTemplateUrl,
        controller: dashboardMainContentCtrl,
        controllerAs: 'mainContentCtrl'
      }
    },
    abstract: true,
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.app.dashboard.designer', {
    url: "/designer",
    templateUrl: dashboardDesignerTemplateUrl
  })
  .state('read.developer.app.dashboard.viewer', {
    url: "/viewer",
    templateUrl: dashboardViewerTemplateUrl,
    controller: dashboardCtrl,
    controllerAs: 'dashboardCtrl'
  })
  .state('read.developer.app.share', {
    url: "/developer/app/share",
    views: {
      'sidenav@': {
        templateUrl: sideNavWrapperTemplateUrl,
        controller: dasSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'maincontent@': {
        templateUrl: dasMainContentTemplateUrl,
        controller: dasMainContentCtrl,
        controllerAs: 'mainContentCtrl'
      }
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground', {
    abstract: true
  })
  .state('read.developer.playground.dataschema', {
    url: "/developer/playground/dataschema",
    views: {
      'sidenav@': {
        templateUrl: sideNavWrapperTemplateUrl,
        controller: schemaSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'maincontent@': {
        templateUrl: schemaMainContentTemplateUrl,
        controller: schemaMainContentCtrl,
        controllerAs: 'mainContentCtrl'
      }
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground.viz', {
    abstract: true
  })
  .state('read.developer.playground.viz.chartjs', {
    url: "/developer/playground/viz/chartjs",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground.viz.nvd3', {
    url: "/developer/playground/nvd3",
    views: {
      'sidenav@': {
        templateUrl: sideNavWrapperTemplateUrl,
        controller: nvd3SideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'maincontent@': {
        templateUrl: nvd3MainContentTemplateUrl,
        controller: nvd3MainContentCtrl,
        controllerAs: 'mainContentCtrl'
      }
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground.viz.leaflet', {
    url: "/developer/playground/viz/leaflet",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground.viz.d3', {
    url: "/developer/playground/viz/d3",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground.viz.dcjs', {
    url: "/developer/playground/viz/dcjs",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.developer.playground.apibridge', {
    url: "/developer/playground/apibridge",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.docs', {
    abstract: true
  })
  .state('read.docs.apireference', {
    url: "/docs/apireference",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.docs.getstarted', {
    url: "/docs/getstarted",
    onEnter: ['readState', function(readState) {
      readState.sidebar.notPresent();
    }]
  })
  .state('read.docs.guide', {
    url: "/docs/guide",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  })
  .state('read.docs.tutorial', {
    url: "/docs/tutorial",
    views: {
      'sidenav@': {
        templateUrl: tutorialSideNavTemplateUrl
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
  })
  .state('read.enduser', {
    abstract: true
  })
  .state('read.enduser.embedviz', {
    url: "/enduser/embedviz",
    onEnter: ['readState', function(readState) {
      readState.sidebar.notPresent();
    }]
  })
  .state('read.enduser.dashboard', {
    url: "/enduser/dashboard",
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  });
}]);

export default angularModule;
