import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const visualizationSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Visualization schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    dashboardId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    templateId: {type: "string"},
    dataSetId: {type: "string"},
    basicOptions: {type: "string"},
    advancedOptions: {type: "string"},
    gridStack: {
      type: "object",
      properties: {
        x: {type: "number"},
        y: {type: "number"},
        height: {type: "number"},
        width: {type: "number"}
      }
    },
  },
  required: ["userId", "appId", "dashboardId", "name", "templateId", "dataSetId", "basicOptions", "advancedOptions", "gridStack"],
  additionalProperties: false
};

export const Visualizations = new Mongo.Collection('visualizations');

let validate = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(visualizationSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Visualization Schema Compilation Error');
}

Meteor.methods({
  'visualization.create'(visualization) {
    if (! validate(visualization)) throw new Error("Schema Validation Failure: visualization object does not match visualization schema in visualization.create");
    return Visualizations.insert(visualization);
  },
  'visualization.delete'(visualizationId) {
    console.log('visualization.delete called with:' + visualizationId);
    return Visualizations.remove({_id: visualizationId});
  },
  'visualization.update'(visualizationId, visualization) {
    if (! validate(visualization)) throw new Error("Schema Validation Failure: visualization object does not match visualization schema in visualization.update");
    return Visualizations.update({_id: visualizationId}, visualization);
  }
});
