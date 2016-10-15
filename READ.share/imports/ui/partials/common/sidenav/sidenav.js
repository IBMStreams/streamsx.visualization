import sideNavTemplate from './sidenav.html';

export const sideNavComponent = {
  bindings: {
    items: '=',
    itemsControl: '=',
    item: '='
  },
  templateUrl: sideNavTemplate
}
