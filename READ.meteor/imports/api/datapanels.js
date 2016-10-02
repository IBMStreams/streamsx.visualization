import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const dataPanelSchema = {
  $schema: "http://json-schema.org/schema#",
  description: "Data Panel schema",
  type: "object",
  properties: {
    userId: {type: "string"},
    appId: {type: "string"},
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    selectedDataSetId: {type: "string"}
  },
  required: ["userId", "appId", "name"],
  additionalProperties: false
};

export const DataPanels = new Mongo.Collection('datapanels');

let validate = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(dataPanelSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: Data Panel Schema Compilation Error');
}

Meteor.methods({
  'dataPanel.create'(dataPanel) {
    if (! validate(dataPanel)) throw new Error("Schema Validation Failure: data panel object does not match data panel schema in dataPanel.create");
    return DataPanels.insert(dataPanel);
  },
  'dataPanel.delete'(dataPanelId) {
    return DataPanels.remove({_id: dataPanelId}); // remove a data panel
  },
  'dataPanel.update'(dataPanelId, dataPanel) {
    if (! validate(dataPanel)) throw new Error("Schema Validation Failure: data panel object does not match data panel schema in dataPanel.update");
    return DataPanels.update({_id: dataPanelId}, dataPanel);
  }
});
