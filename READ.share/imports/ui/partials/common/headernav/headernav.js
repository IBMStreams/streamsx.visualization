import templateUrl from './headernav.html';

export const headerNavComponent = {
    templateUrl: templateUrl,
    bindings: {
      sidebar: '<',
      app: '<'
    },
    controller: ['$scope', '$rootScope', function($scope, $rootScope) {
      this.toggleSidebar = () => {
        this.sidebar.show = ! this.sidebar.show;
        $rootScope.$broadcast('sidebar-toggled');
      };
    }]
};
