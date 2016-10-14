import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

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
