var exports = module.exports = {}

const myModules = {};

(function() {
  myModules.Chart = require('chart.js/dist/Chart.js');
})();

exports.myModules = myModules;
