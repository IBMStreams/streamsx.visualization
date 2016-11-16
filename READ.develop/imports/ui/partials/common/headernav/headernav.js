import { Meteor } from 'meteor/meteor';
import templateUrl from './headernav.html';
import createNewPluginTemplate from './createnewplugin.html'
// intended to work only with the readonly sample app
import 'bootstrap-tour/build/css/bootstrap-tour.css';
import Tour from 'bootstrap-tour/build/js/bootstrap-tour';

import {Users} from '/imports/api/users';

export const headerNavComponent = {
  templateUrl: templateUrl,
  bindings: {
    sidebar: '<'
  },
  controller: ['$scope', '$rootScope', '$state', '$reactive', '$uibModal',
  function($scope, $rootScope, $state, $reactive, $uibModal) {
    $reactive(this).attach($scope);

    this.toggleSidebar = () => {
      this.sidebar.show = ! this.sidebar.show;
      $rootScope.$broadcast('sidebar-toggled');
    };

    this.helpers({
      user: () => Users.findOne({})
    });

    this.createNewPlugin = () => {
      // modal business
      let modalInstance = $uibModal.open({
        controller: ['$scope', '$uibModalInstance',
        function($scope, $uibModalInstance) {

          this.cancel = function() {
            $uibModalInstance.dismiss('cancel');
          };
        }],
        controllerAs: 'modalCtrl',
        size: 'lg',
        templateUrl: createNewPluginTemplate
      });
    };

    // Instance the tour
    let tour = new Tour({
      storage: false,
      onStart: function() {
        $state.go('read.developer.app.dashboard.app');
      },
      steps: [
        {
          element: "#tour",
          title: "Welcome to READ",
          content: "This tour will introduce you to the key features of READ",
          placement: 'bottom'
        }, {
          element: "#myapps",
          title: "My Apps",
          content: "<strong>My Apps</strong> is the key section in READ for dashboard development. \
          Advanced users can also use the <strong>Playground</strong> to define new types of visualizations",
          placement: 'bottom'
        }, {
          element: "#dashboardsbreadcrumb",
          title: "READ App",
          content: "A READ App is a collection of dashboards. A dashboard is a collection of datasets and visualizations. A dataset \
          can be used for creating multiple visualizations.",
          placement: 'auto left'
        }, {
          element: "#dashboardsbreadcrumb",
          title: "Switching between tabs",
          content: "You can switch between the <strong>Apps</strong>, \
          <strong>Dashboards</strong>, <strong>Datasets</strong>, and <strong>Visualizations</strong> \
          tabs using this menu.",
          placement: 'auto left'
        }, {
          element: "#itembreadcrumb",
          title: "Controls",
          content: "Use these <strong>controls</strong> to create, export, import and delete apps within \
          the apps tab. The same goes for dashboards, datasets, and visualizations as well.",
          placement: 'bottom'
        }, {
          element: "#selecteditem",
          title: "Sample App",
          content: "This <strong>sample app</strong> is bundled as part of READ and contains a variety of \
          dashboards, datasets, and visualizations.",
          placement: 'auto right',
          onNext: function() {
            $state.go('read.developer.app.dashboard.dashboard');
          },
        }, {
          element: "#allitems",
          title: "Dashboards",
          content: "An app can contain any number of dashboards.",
          placement: 'auto bottom',
          onNext: function() {
            $state.go('read.developer.app.dashboard.dataset');
          },
          onPrev: function() {
            $state.go('read.developer.app.dashboard.app');
          }
        }, {
          element: "#allitems",
          title: "Datasets",
          content: "A dashboard can contain any number of datasets. READ supports multiple types of datasets \
          such as <strong>URL</strong>, <strong>Raw</strong>, <strong>Websocket</strong>, \
          and <strong>Transformed</strong> datasets. Click on the <em>Usage Info</em> tab to get \
          detailed usage info for a specific type of dataset.",
          placement: 'auto bottom',
          onNext: function() {
            $state.go('read.developer.app.dashboard.designer');
          },
          onPrev: function() {
            $state.go('read.developer.app.dashboard.dashboard');
          }
        }, {
          element: "#allitems",
          title: "Visualizations",
          content: "A dataset can be used to create any number of visualizations. \
          READ supports multiple types of visualizations \
          including maps, time series charts, and other interesting chart types like sunburst \
          and parallel coordinates. Click on the <em>Usage Info</em> tab to get \
          detailed usage info for a specific type of visualization.",
          placement: 'auto bottom',
          onNext: function() {
            $state.go('read.developer.app.dashboard.dashboard');
          },
          onPrev: function() {
            $state.go('read.developer.app.dashboard.dataset');
          }
        }, {
          element: "#allitems",
          title: "Dashboard Layout",
          content: "You can reposition and resize visualizations within the dashboards.",
          placement: 'auto bottom',
          onPrev: function() {
            $state.go('read.developer.app.dashboard.designer');
          }
        }
      ]});

      tour.init();

      this.startTour = function() {
        // Initialize the tour
        if (tour.getCurrentStep()) tour.restart()
        else tour.start(true);
      }
    }]
  };
