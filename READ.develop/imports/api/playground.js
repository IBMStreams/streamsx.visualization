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
    jsonSchema: {type: "string"},
    testData: {type: "string"}
  },
  required: ["userId", "pluginType", "name", "jsonSchema", "testData"],
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
    inputSchemaId: {type: "string"}, // schema for input data
    testData: {type: "string"},
    basicOptionsSchemaId: {type: "string"},
    basicOptions: {type: "string"}, // e.g., axis mappings
    canonicalSchemaId: {type: "string"}, // canonicalTransform should output a result that maches this schema...
    canonicalTransform: {type: "string"}, // transforms data from input schema (e.g., object array) to canonical schema (e.g., time-series)
    advancedOptions: {type: "string"}, // nvd3 option generator with functions and all.. based on canonical data schema
    usageInfo: {type: "string"}
  },
  required: ["userId", "pluginType", "name", "inputSchemaId", "testData",
  "basicOptionsSchemaId", "basicOptions", "canonicalSchemaId", "canonicalTransform", "advancedOptions", "usageInfo"],
  additionalProperties: false
};

export const leafletTemplateSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Leaflet template schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    pluginType: {constant: "leaflet"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    inputSchemaId: {type: "string"},
    testData: {type: "string"},
    usageInfo: {type: "string"}
  },
  required: ["userId", "pluginType", "name", "inputSchemaId", "testData", "usageInfo"],
  additionalProperties: false
};

export const customPluginTemplateSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Custom plugin template schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    pluginType: {constant: "Custom Plugin"},
    pluginId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    inputSchemaId: {type: "string"}, // schema for input data
    testData: {type: "string"},
    basicOptionsSchemaId: {type: "string"},
    basicOptions: {type: "string"}, // e.g., axis mappings
    initFunction: {type: "string"}, // initialize the chart element (independent of data) // includes setting any classes
    updateFunction: {type: "string"}, // update the chart when data changes (called once after init and everytime data changes)
    usageInfo: {type: "string"}
  },
  required: ["userId", "pluginType", "pluginId", "name", "inputSchemaId", "testData",
  "basicOptionsSchemaId", "basicOptions", "initFunction", "updateFunction", "usageInfo"],
  additionalProperties: false
};

export const Playground = new Mongo.Collection('playground');

let dataSchemaValidate = undefined;
let nvd3Validate = undefined;
let leafletValidate = undefined;
let customPluginValidate = undefined;
try {
  dataSchemaValidate = (new ajv({removeAdditional: true})).compile(dataSchemaTemplateSchema);
  nvd3Validate = (new ajv({removeAdditional: true})).compile(nvd3TemplateSchema);
  leafletValidate = (new ajv({removeAdditional: true})).compile(leafletTemplateSchema);
  customPluginValidate = (new ajv({removeAdditional: true})).compile(customPluginTemplateSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Template Schema Compilation Error');
}

let getValidate = (pluginType) => {
  switch (pluginType) {
    case "Data Schema": return dataSchemaValidate;
    case "NVD3": return nvd3Validate;
    case "leaflet": return leafletValidate;
    case "Custom Plugin": return customPluginValidate;
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
