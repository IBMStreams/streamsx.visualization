import pluginDashboardTemplate from './plugindashboard.html';
import {ChartTemplates} from '/imports/api/charttemplates';

// Hack to make gridstack work due to the missing size function
$.fn.size = function(){
  return this.length;
};

export const pluginDashboardComponent = { // dashboard for plugins
  bindings: {
    pluginId: "<"
  },
  templateUrl: pluginDashboardTemplate,
  controller: ['$scope', '$reactive', '$timeout', '$state', 'readState',
  function ($scope, $reactive, $timeout, $state, readState) {
    $reactive(this).attach($scope);
    let self = this;

    this.gsOptions = {
      cellHeight: 80,
      verticalMargin: 10,
      static_grid: true
    };

    this.$onInit = function() {
      self.helpers({
        visualizations: () => ChartTemplates.find({pluginId: self.pluginId}).fetch().map(viz => {
          viz.inputs.forEach(input => input.reactiveData = readState.pipeline.findReactiveData(input.datasetId));
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
    };

  }]
};
