import { Mongo } from 'meteor/mongo';
import { Users } from '/imports/api/users.js';
import { Playground } from '/imports/api/playground';

import guestUser from './userinit';
import playground from './playgroundinit';

// import playground exported by the following command... and the file further modified with default exports...
//mongoexport -h localhost:3001 -d meteor -c playground -o playgroundinit.js --jsonArray --pretty

if (Users.find().count() === 0) {
  Users.insert(guestUser);
}

playground.map(template => {
  Playground.upsert({_id: template._id}, template, {upsert: true});
});
