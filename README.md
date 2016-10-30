# READ: Real-Time Visual Analytics

> **READ is a developer playground for advanced visual analytics**

> Use READ to rapidly create real-time visualizations, responsive sharable dashboards, REST API dataflows, and new types of visualizations.

## Demo
* [READ Sample App](http://169.44.119.88:3002/#/app/jetLpRfQ3BCRGiMxe) with multiple dashboards
with a variety of maps and geo visualizations, dynamic real-time charts, time series visualizations,
and a variety of other chart types such as sunburst and parallel coordinates.

## Getting Started
1. Prerequisites
  * Install [Meteor](https://www.meteor.com)
  * Install [MongoDB](https://www.mongodb.com)
2. Download [READ](https://github.com/IBMStreams/streamsx.visualization/archive/v0.5.2-alpha.zip)
3. Create your READ database folder: `mkdir /my/read/database/folder`
4. Start MongoDB in a terminal: `mongod --port 3001 --dbpath /my/read/database/folder`
5. Build and run READ in a new terminal
  * `export MONGO_URL="mongodb://localhost:3001/readdb"`
  * `cd streamsx.visualization-0.5.2-alpha/READ.develop`
  * `meteor npm install`
  * `meteor`
  * You should see the message *=> App running at: http://localhost:3000/*

## Next steps
* Play with the sample app, dashboards, datasets and visualizations bundled with READ
* Follow the tutorial: http://localhost:3000/#/docs/tutorial

## Sharing READ Dashboards
[READ Sample App](http://169.44.119.88:3002/#/app/jetLpRfQ3BCRGiMxe) is an example of shared READ dashboards. Refer to help topics: http://localhost:3000/#/docs/helptopics for sharing your READ dashboards.

## Running the CORS Proxy service
Refer to help topics: http://localhost:3000/#/docs/helptopics
