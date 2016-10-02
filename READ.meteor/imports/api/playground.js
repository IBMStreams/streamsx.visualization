import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const dataSchemaTemplateSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Data Schema template schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    pluginType: {constant: "Data Schema"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    readOnly: {type: "boolean"},
    jsonSchema: {type: "string"},
    testData: {type: "string"}
  },
  required: ["userId", "pluginType", "name", "readOnly", "jsonSchema", "testData"],
  additionalProperties: false
};

export const nvd3TemplateSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "NVD3 template schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    pluginType: {constant: "NVD3"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    readOnly: {type: "boolean"},
    inputSchemaId: {type: "string"}, // schema for input data
    testData: {type: "string"},
    basicOptionsSchemaId: {type: "string"},
    basicOptions: {type: "string"}, // e.g., axis mappings
    canonicalSchemaId: {type: "string"}, // canonicalTransform should output a result that maches this schema...
    canonicalTransform: {type: "string"}, // transforms data from input schema (e.g., object array) to canonical schema (e.g., time-series)
    advancedOptions: {type: "string"}, // nvd3 option generator with functions and all.. based on canonical data schema
    usageInfo: {type: "string"}
  },
  required: ["userId", "pluginType", "name", "readOnly", "inputSchemaId", "testData",
  "basicOptionsSchemaId", "basicOptions", "canonicalSchemaId", "canonicalTransform", "advancedOptions", "usageInfo"],
  additionalProperties: false
};

export const Playground = new Mongo.Collection('playground');

let dataSchemaValidate = undefined;
let nvd3Validate = undefined;
try {
  dataSchemaValidate = (new ajv({removeAdditional: true})).compile(dataSchemaTemplateSchema);
  nvd3Validate = (new ajv({removeAdditional: true})).compile(nvd3TemplateSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Template Schema Compilation Error');
}

let getValidate = (pluginType) => {
  switch (pluginType) {
    case "Data Schema": return dataSchemaValidate;
    case "NVD3": return nvd3Validate;
    default: throw new Error("Unknown plug in type detected in getValidate");
  }
}

Meteor.methods({
  'playground.create'(template) {
    let validate = getValidate(template.pluginType);
    if (! validate(template)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: template object does not match template schema in playground.create");
    }
    else return Playground.insert(template);
  },
  'playground.delete'(templateId) {
    return Playground.remove({_id: templateId});
  },
  'playground.update'(templateId, template) {
    if (! getValidate(template.pluginType)(template)) throw new Error("Schema Validation Failure: template object does not match template schema in playground.update");
    else return Playground.update({_id: templateId}, template);
  }
});
