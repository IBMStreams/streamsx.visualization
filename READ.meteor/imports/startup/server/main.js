import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users.js';
import {Playground} from '/imports/api/playground';

// playgroundinit.js created using ./playgroundinit.sh

import guestUser from './userinit';
import playground from './playgroundinit';

if (Users.find().count() === 0) {
  Users.insert(guestUser);
}

playground.map(template => {
  Playground.upsert({_id: template._id}, template, {upsert: true});
});
