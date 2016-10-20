export const tutorialSideNavCtrl = ['$scope', 'readState', function ($scope, readState) {
  this.readState = readState;
  this.switch = (tutorial, section) => {
    readState.sidebar.tutorial = section;
    readState.mainContentSelectedTab.tutorial = tutorial;
  };
}];
