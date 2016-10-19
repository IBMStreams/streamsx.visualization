# READ: Real-Time Visual Analytics

## Synopsis
READ is a developer and data scientist playground for advanced visual analytics.

Use READ to rapidly prototype real-time visualizations, responsive sharable dashboards, REST API dataflows, and new types of data visualizations.

## Getting Started
1. Prerequisites
  * Install [Meteor](https://www.meteor.com). Command `meteor` will work if Meteor is installed
  * Install [NodeJS](https://nodejs.org/en/). Commands `node` and `npm` will work if NodeJS is installed
2. Install READ
  * ```git clone https://github.com/IBMStreams/streamsx.visualization.git``` (or download from [here](https://github.com/IBMStreams/streamsx.visualization/archive/master.zip)). This creates the  `streamsx.visualization` repository on your machine.
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor npm install```
  * ```cd ../READ.share```
  * ```meteor npm install```
3. Start READ.meteor in a terminal
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor```
  * Wait for READ.meteor to build and run. You should see the message *=> App running at: http://localhost:3000/*
  * Visit READ developer playground at http://localhost:3000
4. After step 3 is done, start READ.share in a new terminal
  * ```cd streamsx.visualization/READ.share```
  * ```export MONGO_URL="mongodb://localhost:3001/meteor"```
  * ```meteor --port localhost:3002```

## Next steps
Follow the tutorial: http://localhost:3000/#/docs/tutorial
