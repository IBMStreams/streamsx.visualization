import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const pluginSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Plugin schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    selectedTemplate: {type: "string"}
  },
  required: ["userId", "name"],
  additionalProperties: false
};

export const pluginSchemaWithId = JSON.parse(JSON.stringify(pluginSchema));
pluginSchemaWithId.properties._id = {type: "string"};
pluginSchemaWithId.required.push("_id");

export const Plugins = new Mongo.Collection('plugins');

let validate = undefined;
let validateImportable = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(pluginSchema);
  validateImportable = (new ajv({removeAdditional: true})).compile(pluginSchemaWithId);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Plugin Schema Compilation Error');
}

Meteor.methods({
  'plugin.create'(plugin) {
    if (! validate(plugin)) throw new Error("Schema Validation Failure: plugin object does not match plugin schema in plugin.create");
    return Plugins.insert(plugin);
  },
  'plugin.import'(plugin) {
    if (! validateImportable(plugin)) throw new Error("Schema Validation Failure: plugin object does not match plugin schema in plugin.import");
    return Plugins.insert(plugin);
  },
  'plugin.delete'(pluginId) {
    return Plugins.remove({_id: pluginId}); // remove a plugin
  },
  'plugin.update'(pluginId, plugin) {
    if (! validate(plugin)) throw new Error("Schema Validation Failure: plugin object does not match plugin schema in plugin.update");
    return Plugins.update({_id: pluginId}, plugin);
  }
});
