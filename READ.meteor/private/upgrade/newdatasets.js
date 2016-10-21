let _ = require('underscore');

let datasets = require('./datasets.json');
let visualizations = require('./visualizations.json');

visualizations.map(v => {
  let ds = _.find(datasets, d => (d._id === v.dataSetId));
  ds.selectedVisualizationId = v._id;
});

console.log(datasets);
