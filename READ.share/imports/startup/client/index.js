import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMessages from 'angular-messages';
import angularUi from 'angular-ui-bootstrap';

import d3 from 'd3';

import 'nvd3/build/nv.d3.js';
import 'angular-nvd3/dist/angular-nvd3';
import 'nvd3/build/nv.d3.css';

import 'leaflet/dist/leaflet';
import angularLeafletDirective from 'angular-leaflet-directive/dist/angular-leaflet-directive';
import 'drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers.js';
import 'leaflet/dist/leaflet.css';

import {reactiveDataFactory} from 'read-common/imports/api/client/reactivedatafactory.js';
import {reactivePipeline} from 'read-common/imports/api/client/reactivepipeline';
import {readStateFactory} from '/imports/api/client/readstatefactory.js';
import {readCtrl} from '/imports/ui/readctrl.js';

import {dimensionsDirective} from 'read-common/imports/ui/partials/dimensions';

import {headerNavComponent} from '/imports/ui/partials/common/headernav/headernav';
import {sideNavComponent} from '/imports/ui/partials/common/sidenav/sidenav';
import sideNavWrapperTemplateUrl from '/imports/ui/partials/common/sidenav/sidenavwrapper.html';
import {dashboardComponent} from '/imports/ui/partials/dashboard/dashboard';

import developerHomeTemplateUrl from '/imports/ui/pages/developer/home/home.html';

import {dashboardSideNavCtrl} from '/imports/ui/pages/enduser/dashboards/sidenav';
import dashboardMainContentTemplateUrl from '/imports/ui/pages/enduser/dashboards/maincontent.html';
import {dashboardMainContentCtrl} from '/imports/ui/pages/enduser/dashboards/maincontent';

import {nvd3ProviderComponent} from '/imports/ui/partials/visualizations/nvd3/nvd3provider';
import {leafletProviderComponent, leafletMapDirective} from '/imports/ui/partials/visualizations/leaflet/leafletprovider';

import {nvd3VisualizationComponent} from '/imports/ui/partials/visualizations/nvd3/nvd3visualization';
import {leafletVisualizationComponent} from '/imports/ui/partials/visualizations/leaflet/leafletvisualization';
import {visualizationComponent} from '/imports/ui/partials/visualizations/visualization';

// seems necessary to avoid leaflet marker error
L.Icon.Default.imagePath = '/bower_components/leaflet/dist/images';

let name = 'read';

let angularModule = angular.module(name, [angularMeteor, uiRouter, ngMessages, 'ui.bootstrap', 'nvd3', 'leaflet-directive']);

angularModule.factory('reactiveDataFactory', reactiveDataFactory)
.service('reactivePipeline', reactivePipeline)
.factory('readState', readStateFactory)
.directive('dimensions', dimensionsDirective)
.component('headerNav', headerNavComponent)
.component('sideNav', sideNavComponent)
.component('nvd3Provider', nvd3ProviderComponent)
.directive('leafletMap', leafletMapDirective)
.component('leafletProvider', leafletProviderComponent)
.component('visualization', visualizationComponent)
.component('nvd3Visualization', nvd3VisualizationComponent)
.component('leafletVisualization', leafletVisualizationComponent)
.component('dashboard', dashboardComponent)
.controller('readCtrl', readCtrl)

angularModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, send to /home
  $urlRouterProvider.otherwise("/home");

  $stateProvider
  .state('home', {
    url: "/home",
    views: {
      'maincontent@': {
        templateUrl: developerHomeTemplateUrl
      }
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.notPresent();
    }]
  })
  .state('app', {
    url: "/app/:appId",
    views: {
      'sidenav@': {
        templateUrl: sideNavWrapperTemplateUrl,
        controller: dashboardSideNavCtrl,
        controllerAs: 'sideNavCtrl'
      },
      'maincontent@': {
        templateUrl: dashboardMainContentTemplateUrl,
        controller: dashboardMainContentCtrl,
        controllerAs: 'mainContentCtrl'
      }
    },
    resolve: {
      deferredUser: ['readState', (readState) => readState.deferredUser.promise],
      deferredApps: ['readState', (readState) => readState.deferredApps.promise],
      deferredPlayground: ['readState', (readState) => readState.deferredPlayground.promise],
      deferredDataSets: ['readState', (readState) => readState.deferredDataSets.promise],
      deferredDashboards: ['readState', (readState) => readState.deferredDashboards.promise],
      deferredVisualizations: ['readState', (readState) => readState.deferredVisualizations.promise],
    },
    onEnter: ['readState', function(readState) {
      readState.sidebar.isPresent();
    }]
  });

}]);

export default angularModule;
