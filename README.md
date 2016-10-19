# READ: Real-Time Visual Analytics

## Synopsis
READ is a developer and data scientist playground for advanced visual analytics.

Use READ to rapidly prototype real-time visualizations, responsive sharable dashboards, REST API dataflows, and new types of data visualizations.

## Getting Started
1. Prerequisites
  * Install Meteor: https://www.meteor.com ; Command <code>meteor</code> will work if Meteor is installed
  * Install NodeJS: https://nodejs.org/en/ ; Commands <code>node</code> and <code>npm</code> will work if Meteor is installed
2. Install READ
  * ```git clone https://github.com/IBMStreams/streamsx.visualization.git``` (or download from [here](https://github.com/IBMStreams/streamsx.visualization/archive/master.zip))
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor npm install```
  * ```cd streamsx.visualization/READ.share```
  * ```meteor npm install```
3. Start READ.meteor
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor```
  * Visit READ playground at http://localhost:3000
4. Start READ.share (after READ.meteor starts running at http://localhost:3000)
  * ```cd streamsx.visualization/READ.share```
  * ```export MONGO_URL="mongodb://localhost:3001/meteor"```
  * ```meteor --port 3002```

## Next steps
Follow the tutorial: http://localhost:3000/#/docs/tutorial
