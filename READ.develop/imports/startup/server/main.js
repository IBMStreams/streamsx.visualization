import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users.js';
import {Playground} from '/imports/api/playground';
import {Apps} from '/imports/api/apps';
import {Dashboards} from '/imports/api/dashboards';
import {DataSets} from '/imports/api/datasets';
import {Visualizations} from '/imports/api/visualizations';

import guestUser from './userinit';
import playground from './playgroundinit';
import apps from './sampleappinit';
import dashboards from './sampledashboardsinit';
import datasets from './sampledatasetsinit';
import visualizations from './samplevisualizationsinit';

if (Apps.find().count() === 0) {
  apps.map(app => {
    Apps.upsert({_id: app._id}, app, {upsert: true}, (err, res) => {
      dashboards.map(dashboard => {
        Dashboards.upsert({_id: dashboard._id}, dashboard, {upsert: true});
      });
      datasets.map(dataset => {
        DataSets.upsert({_id: dataset._id}, dataset, {upsert: true});
      });
      visualizations.map(visualization => {
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
