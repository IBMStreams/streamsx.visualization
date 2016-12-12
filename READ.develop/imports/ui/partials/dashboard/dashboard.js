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

    function extractGridDimensions() {
      return _.filter(_.map($('.grid-stack > .grid-stack-item'), function (el) {
        el = $(el);
        var node = el.data('_gridstack_node');
        if (node) {
          return {
            _id: el.attr('data-visualization-id'),
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height
          }
        }
        else return undefined;
      }), x => x);
    };

    function updateGridDimensions(res) {
      res.map(gridPoint => {
        let viz = Visualizations.findOne({_id: gridPoint._id});
        viz.gridStack.x = gridPoint.x;
        viz.gridStack.y = gridPoint.y;
        viz.gridStack.height = gridPoint.height;
        viz.gridStack.width = gridPoint.width;
        Meteor.call('visualization.update', viz._id, viz, (err, res) => {
          if (err) alert(err);
        });
      });
    }

    function fixGrid() {
      let res = extractGridDimensions();
      $timeout(function() {
        updateGridDimensions(res);
      }, 200);
    }

    this.$onInit = function() {
      self.visualizations = Visualizations.find({dashboardId: self.dashboardId}).fetch().map(viz => {
        viz.dimensions = {
          height: undefined,
          width: undefined
        };
        return viz;
      });

      if (self.gsOptions) {
        $timeout(function() {
          $(function () {
            $('.grid-stack').gridstack(self.gsOptions);
            fixGrid();
          });

          $('.grid-stack').on('resizestop', function (event, ui) {
            fixGrid();
          });

          $('.grid-stack').on('dragstop', function (event, ui) {
            fixGrid();
          });
        }, 1);
      }
      else throw new Error('undefined gsOptions in dashboard component');
    };

  }]
};
