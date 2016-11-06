// this needs to work for both shared and dev dashboards...
import {Users} from '/imports/api/users';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';

export const dashboardDashboardCtrl = ['$scope', '$reactive', function ($scope, $reactive) {
  $reactive(this).attach($scope);
  let self = this;

  this.helpers({
    user: () => Users.findOne({}),
    app: () => Apps.findOne({_id: self.getReactively('user.selectedIds.appId')}),
    dashboard: () => Dashboards.findOne({_id: self.getReactively('app.selectedDashboardId')}),
    gsOptions: () => {
      return {
        cellHeight: 80,
        verticalMargin: 10,
        static_grid: self.getReactively('user.readOnly'),
        draggable: {
          handle: '.panel-heading',
        }
      }
    }
  });

}];
