import { Meteor } from 'meteor/meteor';
import templateUrl from './headernav.html';

import {Users} from '/imports/api/users';

export const headerNavComponent = {
    templateUrl: templateUrl,
    bindings: {
      sidebar: '<',
      app: '<'
    },
    controller: ['$scope', '$rootScope', '$reactive',
    function($scope, $rootScope, $reactive) {
      $reactive(this).attach($scope);
      
      this.toggleSidebar = () => {
        this.sidebar.show = ! this.sidebar.show;
        $rootScope.$broadcast('sidebar-toggled');
      };

      this.helpers({
        user: () => Users.findOne({})
      });

    }]
};
