# READ: Real-Time Visual Analytics

> **READ is a developer playground for advanced visual analytics**

> Use READ to rapidly create real-time visualizations, responsive sharable dashboards, REST API dataflows, and new types of visualizations.

## Getting Started
1. Prerequisites
  * Install [Meteor](https://www.meteor.com). Command `meteor` will work if Meteor is installed
  * Install [MongoDB](https://www.mongodb.com). Commands `mongod`, `mongo`, and `mongoexport` will work if MongoDB is installed
  * Install [NodeJS](https://nodejs.org/) (optional). Commands `node` and `npm` will work if NodeJS is installed. NodeJS is necessary if you wish to run the `CORS proxy` bundled with READ, or if you wish create the
  dynamic API needed by the `Dynamics` dashboard of the `Sample` app bundled with READ.
2. Download READ
  * [v0.5.1-alpha](https://github.com/IBMStreams/streamsx.visualization/archive/v0.5.1-alpha.zip). Uncompress this file to create the  `streamsx.visualization-0.5.1-alpha` folder on your machine.
3. Create your READ database folder
  * `mkdir /my/read/database/folder`
  * We recommend that you create your READ database folder outside the `streamsx.visualization-0.5.1-alpha` folder for ease of upgrading READ in the future.
4. Start MongoDB in a terminal
  * `mongod --port 3001 --dbpath /my/read/database/folder`. This starts MongoDB at the URL localhost:3001.
5. Build and run READ in a new terminal
  * `export MONGO_URL="mongodb://localhost:3001/readdb"`. This tells READ to use `readdb` as the READ database.
  * `cd streamsx.visualization-0.5.1-alpha/READ.develop`
  * `meteor npm install`. This installs all the dependencies needed by READ.
  * `meteor`. This builds and runs READ at http://localhost:3000.
  * You should see the message *=> App running at: http://localhost:3000/*

## Next steps
* Play with the sample app, dashboards, datasets and visualizations bundled with READ
* Follow the tutorial: http://localhost:3000/#/docs/tutorial

## Sharing READ Dashboards
Refer to help topics: http://localhost:3000/#/docs/helptopics

## Running the CORS Proxy server
Refer to help topics: http://localhost:3000/#/docs/helptopics
