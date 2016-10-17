# READ: Real-Time Visual Analytics

## Synopsis
READ is a developer playground for advanced visual analytics.

Use READ to create Real-time Visualizations, 
Responsive Sharable Dashboards, REST API Dataflows, and for rapid prototyping and customization advanced
real-time visual analytics.

## Getting Started
1. Prerequisites
  * Meteor: https://www.meteor.com
2. Install
  * ```git clone https://github.com/IBMStreams/streamsx.visualization.git``` (or download from [here](https://github.com/IBMStreams/streamsx.visualization/archive/master.zip))
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor npm install```
  * ```cd streamsx.visualization/READ.share```
  * ```meteor npm install```
3. Start READ.meteor
  * ```cd streamsx.visualization/READ.meteor```
  * ```meteor```
  * Visit READ playground at http://localhost:3000
4. Start READ.share
  * ```cd streamsx.visualization/READ.share```
  * ```export MONGO_URL="mongodb://localhost:3001/meteor"```
  * ```meteor --port 3002```

## Next steps
Follow the tutorial: http://localhost:3000/#/docs/tutorial
