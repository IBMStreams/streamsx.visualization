// this needs to work for both shared and dev dashboards...
import dashboardTemplate from './dashboard.html';

import {Visualizations} from '/imports/api/visualizations';

// Hack to make gridstack work due to the missing size function
$.fn.size = function(){
  return this.length;
};

export const dashboardComponent = {
  bindings: {
    gsOptions: "=",
    dashboardId: "<"
  },
  templateUrl: dashboardTemplate,
  controller: ['$scope', '$reactive', '$timeout', '$state', 'readState',
  function ($scope, $reactive, $timeout, $state, readState) {
    $reactive(this).attach($scope);
    let self = this;

    this.$onInit = function() {
      self.helpers({
        visualizations: () => Visualizations.find({dashboardId: self.dashboardId}).fetch().map(viz => {
            viz.dimensions = {
              height: undefined,
              width: undefined
            };
            return viz;
        })
      });

      if (self.gsOptions) {
        $timeout(function() {
          $(function () {
            $('.grid-stack').gridstack(self.gsOptions);
          });
        }, 1);
      }
      else throw new Error('undefined gsOptions in dashboard component');
    }

  }]
};
