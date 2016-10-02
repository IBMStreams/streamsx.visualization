import {Mongo} from 'meteor/mongo';
import ajv from 'ajv';

export const userSchema = {
  schema: "http://json-schema.org/schema#",
  description: "User schema",
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20
    },
    selectedIds: {
      type: "object",
      properties: {
        appId: {type: "string"},
        dataSchemaId: {type: "string"},
        chartJSId: {type: "string"},
        nvd3Id: {type: "string"},
        vegaId: {type: "string"},
        leafletId: {type: "string"},
        d3Id: {type: "string"},
        dcjsId: {type: "string"},
        apiBridgeId: {type: "string"}
      },
      additionalProperties: false,
    },
    shareServiceURL: {type: "string"}
  },
  required: ["name", "selectedIds", "shareServiceURL"],
  additionalProperties: false
};

export const Users = new Mongo.Collection('users');

let validate = undefined;
try {
  validate = (new ajv({removeAdditional: true})).compile(userSchema);
}
catch (e) {
  console.log(e);
  throw new Error('Invalid JSON Schema: User Schema Compilation Error');
}

Meteor.methods({
  'user.update'(user) {
    if (! validate(user)) {
      throw new Error("Schema Validation Failure: user object does not match user schema in user.update");
    } else {
      return Users.update({
        _id: 'guest'
      }, user)
    };
  }
});
