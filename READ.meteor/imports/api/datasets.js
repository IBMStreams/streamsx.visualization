import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const rawDataSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Raw Data schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    dataPanelId: {type: "string"},
    dataSetType: {constant: "raw"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    rawData: {type: "string"}
  },
  required: ["userId", "appId", "dataPanelId", "dataSetType", "name", "rawData"],
  additionalProperties: false
};

export const DataSets = new Mongo.Collection('datasets');

let rawDataSchemaValidate = undefined;
try {
  rawDataSchemaValidate = (new ajv({removeAdditional: true})).compile(rawDataSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Raw Data Schema Compilation Error');
}

let getValidate = (dataSetType) => {
  switch (dataSetType) {
    case "raw": return rawDataSchemaValidate;
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
    if (! getValidate(dataSet.dataSetType)(dataSet)) throw new Error("Schema Validation Failure: dataset object does not match dataset schema in dataset.update");
    else return DataSets.update({_id: dataSetId}, dataSet);
  }
});
