import templateUrl from './headernav.html';
// intended to work only with the readonly sample app
import 'bootstrap-tour/build/css/bootstrap-tour.css';
import Tour from 'bootstrap-tour/build/js/bootstrap-tour';

export const headerNavComponent = {
  templateUrl: templateUrl,
  bindings: {
    sidebar: '<'
  },
  controller: ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
    this.toggleSidebar = () => {
      this.sidebar.show = ! this.sidebar.show;
      $rootScope.$broadcast('sidebar-toggled');
    };

    // Instance the tour
    let tour = new Tour({
      storage: false,
      steps: [
        {
          element: "#tour",
          title: "Welcome to READ",
          content: "This tour will introduce you to the key features of READ",
          onNext: function() {
            $state.go('read.developer.app.dashboard.app');
          },
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
          content: "An app can contain any number of dashboards. Visualizations can \
          be positioned and resized \
          in the dashboard after their creation in the visualizations tab.",
          placement: 'auto bottom',
          onNext: function() {
            $state.go('read.developer.app.dashboard.dataset');
          },
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
