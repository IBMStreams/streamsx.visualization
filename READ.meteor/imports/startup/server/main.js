import { Meteor } from 'meteor/meteor';

import {Users} from '/imports/api/users.js';
import {Playground} from '/imports/api/playground';

// Here's how we got playgroundinit.js (and everything else)
// mongoexport -h localhost:3001 -d meteor -c playground -o playgroundinit.js --jsonArray --pretty
// and then attach 'export default Playground =' at head of the file

import guestUser from './userinit';
import playground from './playgroundinit';

if (Users.find().count() === 0) {
  Users.insert(guestUser);
}

playground.map(template => {
  Playground.upsert({_id: template._id}, template, {upsert: true});
});
