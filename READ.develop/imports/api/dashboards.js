import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const dashboardSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Dashboard schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    selectedDataSetId: {type: "string"}
  },
  required: ["userId", "appId", "name"],
  additionalProperties: false
};

export const dashboardSchemaWithId = JSON.parse(JSON.stringify(dashboardSchema));
dashboardSchemaWithId.properties._id = {type: "string"};
dashboardSchemaWithId.required.push("_id");

export const Dashboards = new Mongo.Collection('dashboards');

let validate = undefined;
let validateImportable = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(dashboardSchema);
  validateImportable = (new ajv({removeAdditional: true})).compile(dashboardSchemaWithId);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Dashboard Schema Compilation Error');
}

Meteor.methods({
  'dashboard.create'(dashboard) {
    if (! validate(dashboard)) throw new Error("Schema Validation Failure: dashboard object does not match dashboard schema in dashboard.create");
    return Dashboards.insert(dashboard);
  },
  'dashboard.import'(dashboard) {
    if (! validateImportable(dashboard)) throw new Error("Schema Validation Failure: dashboard object does not match dashboard schema in dashboard.import");
    return Dashboards.insert(dashboard);
  },
  'dashboard.delete'(dashboardId) {
    return Dashboards.remove({_id: dashboardId}); // remove a dashboard
  },
  'dashboard.update'(dashboardId, dashboard) {
    if (! validate(dashboard)) throw new Error("Schema Validation Failure: dashboard object does not match dashboard schema in dashboard.update");
    return Dashboards.update({_id: dashboardId}, dashboard);
  }
});
