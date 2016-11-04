import {Mongo} from 'meteor/mongo';
import _ from 'underscore';

import ajv from 'ajv';
import {dashboardSchema, dashboardSchemaWithId} from './dashboards';
import {dataSetSchema, dataSetSchemaWithId} from './datasets';
import {visualizationSchema, visualizationSchemaWithId} from './visualizations';

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
    selectedDashboardId: {type: "string"}
  },
  required: ["userId", "name", "private"],
  additionalProperties: false
};

let appSchemaWithId = JSON.parse(JSON.stringify(appSchema));
appSchemaWithId.properties._id = {type: "string"};
appSchemaWithId.required.push("_id");

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
    app: appSchemaWithId,
    dashboard: dashboardSchemaWithId,
    dataSet: dataSetSchemaWithId,
    visualization: visualizationSchemaWithId
  },
};

export const Apps = new Mongo.Collection('apps');

let validate = undefined;
let validateImportable = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(appSchema);
  validateImportable = (new ajv({removeAdditional: true})).compile(appSchemaWithId);
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
  'app.import'(app) {
    if (! validateImportable(app)) throw new Error("Schema Validation Failure: app object does not match app schema in app.import");
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
