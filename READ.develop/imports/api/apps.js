import {Mongo} from 'meteor/mongo';
import _ from 'underscore';

import ajv from 'ajv';
import {dashboardSchema} from './dashboards';
import {dataSetSchema} from './datasets';
import {visualizationSchema} from './visualizations';

export const appSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "App schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    private: {type: "boolean"},
    readOnly: {type: "boolean"},
    selectedDashboardId: {type: "string"}
  },
  required: ["userId", "name", "private", "readOnly"],
  additionalProperties: false
};

let _appSchema = JSON.parse(JSON.stringify(appSchema));
_appSchema.properties._id = {type: "string"};
_appSchema.required.push("_id");

let _dashboardSchema = JSON.parse(JSON.stringify(dashboardSchema));
_dashboardSchema.properties._id = {type: "string"};
_dashboardSchema.required.push("_id");

let _dataSetSchema = JSON.parse(JSON.stringify(dataSetSchema));
_dataSetSchema.oneOf.forEach(r => {
  r.properties._id = {type: "string"};
  r.required.push("_id")
});

let _visualizationSchema = JSON.parse(JSON.stringify(visualizationSchema));
_visualizationSchema.oneOf.forEach(r => {
  r.properties._id = {type: "string"};
  r.required.push("_id")
});

export const importedAppSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Exported app schema",
  type: "object",
  properties: {
    version: {type: "string"},
    app: {$ref: "#/definitions/app"},
    dashboards: {
      type: "array",
      items: {$ref: "#/definitions/dashboard"}
    },
    dataSets: {
      type: "array",
      items: {$ref: "#/definitions/dataSet"}
    },
    visualizations: {
      type: "array",
      items: {$ref: "#/definitions/visualization"}
    }
  },
  required: ["version", "app", "dashboards", "dataSets", "visualizations"],
  additionalProperties: false,
  definitions: {
    app: _appSchema,
    dashboard: _dashboardSchema,
    dataSet: _dataSetSchema,
    visualization: _visualizationSchema
  },
};

export const Apps = new Mongo.Collection('apps');

let validate = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(appSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: App Schema Compilation Error');
}

Meteor.methods({
  'app.create'(app) {
    if (! validate(app)) throw new Error("Schema Validation Failure: app object does not match app schema in app.create");
    return Apps.insert(app);
  },
  'app.delete'(appId) {
    return Apps.remove({_id: appId}); // remove an app
  },
  'app.update'(appId, app) {
    if (! validate(app)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: app object does not match app schema in app.update");
    }
    return Apps.update({_id: appId}, app);
  }
});
