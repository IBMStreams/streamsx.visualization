import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users.js';
import {Playground} from '/imports/api/playground';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {DataSets} from '/imports/api/datasets';
import {Visualizations} from '/imports/api/visualizations';
import {Plugins} from '/imports/api/plugins';
import {PlaygroundDatasets} from '/imports/api/playgrounddatasets';
import {ChartTemplates} from '/imports/api/charttemplates';

import guestUser from './userinit';
import playground from './playgroundinit';
import apps from './sampleappinit';
import dashboards from './sampledashboardsinit';
import datasets from './sampledatasetsinit';
import visualizations from './samplevisualizationsinit';

if (Apps.find().count() === 0) {
  apps.map(app => {
    Apps.upsert({_id: app._id}, app, {upsert: true}, (err, res) => {
      dashboards.filter(d => d.appId === app._id).map(dashboard => {
        Dashboards.upsert({_id: dashboard._id}, dashboard, {upsert: true});
      });
      datasets.filter(d => d.appId === app._id).map(dataset => {
        DataSets.upsert({_id: dataset._id}, dataset, {upsert: true});
      });
      visualizations.filter(d => d.appId === app._id).map(visualization => {
        Visualizations.upsert({_id: visualization._id}, visualization, {upsert: true});
      });
    });
  });
}

if (Users.find().count() === 0) {
  Users.insert(guestUser);
}

if (Playground.find().count() === 0) {
  playground.map(template => {
    Playground.upsert({_id: template._id}, template, {upsert: true});
  });
}
