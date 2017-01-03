import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const chartTemplateSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Chart Template schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    pluginId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    initFunction: {type: "string"},
    inputs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 20
          },
          datasetId: {type: "string"},
          dataHandler: {type: "string"}
        },
        required: ["name", "datasetId", "dataHandler"],
        additionalProperties: false
      }
    },
    cleanupFunction: {type: "string"},
    options: {type: "string"},
    css: {type: "string"},
    position: {type: "number"}
  },
  required: ["userId", "pluginId", "name", "initFunction", "inputs", "position"],
  additionalProperties: false
};

export const chartTemplateSchemaWithId = JSON.parse(JSON.stringify(chartTemplateSchema));
chartTemplateSchemaWithId.properties._id = {type: "string"};
chartTemplateSchemaWithId.required.push("_id");

export const ChartTemplates = new Mongo.Collection('charttemplates');

let validate = undefined;
let validateImportable = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(chartTemplateSchema);
  validateImportable = (new ajv({removeAdditional: true})).compile(chartTemplateSchemaWithId);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Chart Template Schema Compilation Error');
}

Meteor.methods({
  'chartTemplate.create'(chartTemplate) {
    if (! validate(chartTemplate)) throw new Error("Schema Validation Failure: chart template object does not match chart template schema in chartTemplate.create");
    return ChartTemplates.insert(chartTemplate);
  },
  'chartTemplate.import'(chartTemplate) {
    if (! validateImportable(chartTemplate)) throw new Error("Schema Validation Failure: chart template object does not match chart template schema in chartTemplate.import");
    return ChartTemplates.insert(chartTemplate);
  },
  'chartTemplate.delete'(chartTemplateId) {
    return ChartTemplates.remove({_id: chartTemplateId}); // remove a chart template
  },
  'chartTemplate.update'(chartTemplateId, chartTemplate) {
    if (! validate(chartTemplate)) throw new Error("Schema Validation Failure: chart template object does not match chart template schema in chartTemplate.update");
    return ChartTemplates.update({_id: chartTemplateId}, chartTemplate);
  }
});
