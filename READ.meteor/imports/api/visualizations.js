import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const nvd3VisualizationSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Visualization schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    pluginType: {constant: "NVD3"},
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

export const leafletVisualizationSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Visualization schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    pluginType: {constant: "leaflet"},
    appId: {type: "string"},
    dashboardId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    templateId: {type: "string"},
    dataSetId: {type: "string"},
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
  required: ["userId", "appId", "dashboardId", "name", "templateId", "dataSetId", "gridStack"],
  additionalProperties: false
};

export const Visualizations = new Mongo.Collection('visualizations');

let nvd3Validate = undefined;
let leafletValidate = undefined;
try {
  nvd3Validate = (new ajv({removeAdditional: true})).compile(nvd3VisualizationSchema);
  leafletValidate = (new ajv({removeAdditional: true})).compile(leafletVisualizationSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Template Schema Compilation Error');
}

let getValidate = (pluginType) => {
  switch (pluginType) {
    case "NVD3": return nvd3Validate;
    case "leaflet": return leafletValidate;
    default: throw new Error("Unknown plugin type detected in getValidate");
  }
}


Meteor.methods({
  'visualization.create'(visualization) {
    let validate = getValidate(visualization.pluginType);
    if (! validate(visualization)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: visualization object does not match visualization schema in visualization.create");
    }
    return Visualizations.insert(visualization);
  },
  'visualization.delete'(visualizationId) {
    console.log('visualization.delete called with:' + visualizationId);
    return Visualizations.remove({_id: visualizationId});
  },
  'visualization.update'(visualizationId, visualization) {
    let validate = getValidate(visualization.pluginType);
    if (! validate(visualization)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: visualization object does not match visualization schema in visualization.update");
    }
    return Visualizations.update({_id: visualizationId}, visualization);
  }
});
