# READ: Real-Time Visual Analytics

> **READ is a developer playground for advanced visual analytics**

> Use READ to rapidly create real-time visualizations, responsive sharable dashboards, REST API dataflows, and new types of visualizations.

## Getting Started
1. Prerequisites
  * Install [Meteor](https://www.meteor.com)
  * Install [MongoDB](https://www.mongodb.com)
  * Install [NodeJS](https://nodejs.org/) (optional)
2. Download [READ](https://github.com/IBMStreams/streamsx.visualization/archive/v0.5.1-alpha.zip)
3. Create your READ database folder: `mkdir /my/read/database/folder`
4. Start MongoDB in a terminal: `mongod --port 3001 --dbpath /my/read/database/folder`
5. Build and run READ in a new terminal
  * `export MONGO_URL="mongodb://localhost:3001/readdb"`
  * `cd streamsx.visualization-0.5.1-alpha/READ.develop`
  * `meteor npm install`
  * `meteor`
  * You should see the message *=> App running at: http://localhost:3000/*

## Next steps
* Play with the sample app, dashboards, datasets and visualizations bundled with READ
* Follow the tutorial: http://localhost:3000/#/docs/tutorial

## Sharing READ Dashboards
Refer to help topics: http://localhost:3000/#/docs/helptopics

## Running the CORS Proxy service
Refer to help topics: http://localhost:3000/#/docs/helptopics
