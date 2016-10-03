# READ: Real-Time Visual Analytics

## Synopsis
READ is a cloud-ready developer-centric API-friendly playground for visual analytics. Use READ to rapidly create advanced, reactive, interactive, and real-time visualizations and dashboards by combining data from Streams based APIs, Watson APIs, and any other APIs of your choice.

## Getting Started
1. Prerequisites
  * Meteor: https://www.meteor.com
2. Install
  * ```git clone https://github.com/IBMStreams/streamsx.visualization.git``` (or download from [here](https://github.com/IBMStreams/streamsx.visualization/archive/master.zip))
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor npm install```
  * ```cd streamsx.visualization/READ.share```
  * ```meteor npm install```
3. Start READ
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor```
  * Visit READ playground at http://localhost:3000
4. Start READ.share service which lets you share READ dashboards
  * ```cd streamsx.visualization/READ.share```
  * ```export MONGO_URL="mongodb://localhost:3001/meteor"```
  * ```meteor --port 3002```
5. Next steps
  * Follow the tutorial: http://localhost:3000/#/docs/tutorial
