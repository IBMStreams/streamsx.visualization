import {Mongo} from 'meteor/mongo';
import _ from 'underscore/underscore';
import ajv from 'ajv';

export const rawDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Raw Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    datasetType: {
      type: "string",
      enum: ["Raw"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    rawData: {type: "string"},
    position: {type: "number"}
  },
  required: ["userId", "datasetType", "name", "rawData", "position"],
  additionalProperties: false
};

export const WebSocketDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "WebSocket Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    datasetType: {
      type: "string",
      enum: ["WebSocket"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    url: {type: "string"},
    position: {type: "number"}
  },
  required: ["userId", "datasetType", "name", "url", "position"],
  additionalProperties: false
};

export const URLDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "URL Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    datasetType: {
      type: "string",
      enum: ["URL"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    url: {type: "string"},
    poll: {
      type: "object",
      properties: {
        enabled: {type: "boolean"},
        intervalMilliSec: {type: "number"}
      },
      required: ["enabled"]
    },
    position: {type: "number"}
  },
  required: ["userId", "datasetType", "name", "url", "poll", "position"],
  additionalProperties: false
};

// We are enabling state by default in this derived data
export const derivedDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Derived Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    datasetType: {
      type: "string",
      enum: ["Derived"]
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    parents: {
      type: "array",
      items: {type: "string"}
    },
    transformFunction: {type: "string"},
    position: {type: "number"}
  },
  required: ["userId", "datasetType", "name", "parents", "transformFunction", "position"],
  additionalProperties: false
};

export const playgroundDatasetSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Dataset schema",
  oneOf: [rawDataSchema, URLDataSchema, WebSocketDataSchema, derivedDataSchema]
};

export const playgroundDatasetSchemaWithId = JSON.parse(JSON.stringify(playgroundDatasetSchema));
playgroundDatasetSchemaWithId.oneOf.forEach(r => {
  r.properties._id = {type: "string"};
  r.required.push("_id")
});

export const PlaygroundDatasets = new Mongo.Collection('playgrounddatasets');

let rawDataSchemaValidate = undefined;
let URLDataSchemaValidate = undefined;
let WebSocketDataSchemaValidate = undefined;
let derivedDataSchemaValidate = undefined;
try {
  rawDataSchemaValidate = (new ajv({removeAdditional: true})).compile(rawDataSchema);
  URLDataSchemaValidate = (new ajv({removeAdditional: true})).compile(URLDataSchema);
  WebSocketDataSchemaValidate = (new ajv({removeAdditional: true})).compile(WebSocketDataSchema);
  derivedDataSchemaValidate = (new ajv({removeAdditional: true})).compile(derivedDataSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Data Schema Compilation Error');
}

let getValidate = (datasetType) => {
  switch (datasetType) {
    case "Raw": return rawDataSchemaValidate;
    case "URL": return URLDataSchemaValidate;
    case "WebSocket": return WebSocketDataSchemaValidate;
    case "Derived": return derivedDataSchemaValidate;
    default: throw new Error("Unknown dataset type detected in getValidate");
  }
}

let getValidateWithId = (datasetType) => {
  let v = _.find(datasetSchemaWithId.oneOf, (r => r.properties.datasetType.enum[0] === datasetType));
  if (! v) throw new Error('Unknown dataset type detected in getValidateWithId');
  return (new ajv({removeAdditional: true})).compile(v);
}

Meteor.methods({
  'playgroundDataset.create'(dataset) {
    let validate = getValidate(dataset.datasetType);
    if (! validate(dataset)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: dataset object does not match dataset schema in playgroundDataset.create");
    }
    else return PlaygroundDatasets.insert(dataset);
  },
  'playgroundDataset.delete'(datasetId) {
    return PlaygroundDatasets.remove({_id: datasetId});
  },
  'playgroundDataset.update'(datasetId, dataset) {
    let validate = getValidate(dataset.datasetType);
    if (! validate(dataset)) {
      console.log(validate.errors);
      throw new Error("Schema Validation Failure: dataset object does not match dataset schema in playgroundDataset.update");
    } else return PlaygroundDatasets.update({_id: datasetId}, dataset);
  }
});
