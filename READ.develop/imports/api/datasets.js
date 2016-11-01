import {Mongo} from 'meteor/mongo';
import _ from 'underscore/underscore';
import ajv from 'ajv';

export const rawDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Raw Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    dashboardId: {type: "string"},
    dataSetType: {
      type: "string",
      enum: ["raw"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    selectedVisualizationId: {type: "string"},
    rawData: {type: "string"}
  },
  required: ["userId", "appId", "dashboardId", "dataSetType", "name", "rawData"],
  additionalProperties: false
};

export const simpleHTTPDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Simple HTTP Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    dashboardId: {type: "string"},
    dataSetType: {
      type: "string",
      enum: ["simpleHTTP"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    selectedVisualizationId: {type: "string"},
    url: {type: "string"},
    poll: {
      type: "object",
      properties: {
        enabled: {type: "boolean"},
        intervalSec: {type: "number"}
      },
      required: ["enabled"]
    }
  },
  required: ["userId", "appId", "dashboardId", "dataSetType", "name", "url", "poll"],
  additionalProperties: false
};

export const extendedHTTPDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Extended HTTP Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    dashboardId: {type: "string"},
    dataSetType: {
      type: "string",
      enum: ["extendedHTTP"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    parentId: {type: "string"},
    selectedVisualizationId: {type: "string"},
    poll: {
      type: "object",
      properties: {
        enabled: {type: "boolean"},
        intervalSec: {type: "number"}
      },
      required: ["enabled"]
    }
  },
  required: ["userId", "appId", "dashboardId", "dataSetType", "name", "parentId", "poll"],
  additionalProperties: false
};

export const transformedDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Transformed Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    dashboardId: {type: "string"},
    dataSetType: {
      type: "string",
      enum: ["transformed"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    selectedVisualizationId: {type: "string"},
    parents: {
      type: "array",
      items: {type: "string"}
    },
    stateParams: {
      type: "object",
      properties: {
        enabled: {type: "boolean"},
        state: {type: "string"}
      },
      required: ["enabled"]
    },
    transformFunction: {type: "string"}
  },
  required: ["userId", "appId", "dashboardId", "dataSetType", "name", "parents", "stateParams", "transformFunction"],
  additionalProperties: false
};

export const dataSetSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Dataset schema",
  oneOf: [rawDataSchema, simpleHTTPDataSchema, transformedDataSchema]
};

export const DataSets = new Mongo.Collection('datasets');

let rawDataSchemaValidate = undefined;
let simpleHTTPDataSchemaValidate = undefined;
let extendedHTTPDataSchemaValidate = undefined;
let transformedDataSchemaValidate = undefined;
try {
  rawDataSchemaValidate = (new ajv({removeAdditional: true})).compile(rawDataSchema);
  simpleHTTPDataSchemaValidate = (new ajv({removeAdditional: true})).compile(simpleHTTPDataSchema);
  extendedHTTPDataSchemaValidate = (new ajv({removeAdditional: true})).compile(extendedHTTPDataSchema);
  transformedDataSchemaValidate = (new ajv({removeAdditional: true})).compile(transformedDataSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Data Schema Compilation Error');
}

let getValidate = (dataSetType) => {
  switch (dataSetType) {
    case "raw": return rawDataSchemaValidate;
    case "simpleHTTP": return simpleHTTPDataSchemaValidate;
    case "extendedHTTP": return extendedHTTPDataSchemaValidate;
    case "transformed": return transformedDataSchemaValidate;
    default: throw new Error("Unknown dataset type detected in getValidate");
  }
}

Meteor.methods({
  'dataSet.create'(dataSet) {
    let validate = getValidate(dataSet.dataSetType);
    if (! validate(dataSet)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: dataset object does not match dataset schema in dataset.create");
    }
    else return DataSets.insert(dataSet);
  },
  'dataSet.delete'(dataSetId) {
    return DataSets.remove({_id: dataSetId});
  },
  'dataSet.update'(dataSetId, dataSet) {
    let validate = getValidate(dataSet.dataSetType);
    if (! validate(dataSet)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: dataset object does not match dataset schema in dataset.update");
    } else return DataSets.update({_id: dataSetId}, dataSet);
  }
});
