# READ: Real-time Visual Analytics

## Synopsis
READ is a cloud-ready developer-centric API-friendly tool for visual analytics. Use READ to rapidly create advanced, reactive, interactive, and real-time visualizations and dashboards by combining data from Streams based APIs, Watson APIs, and any other APIs of your choice.

## Getting Started
1. Prerequisites
  * Node.js: https://nodejs.org/
2. Install
  * ```git clone git@github.ibm.com:spartha/READ.git``` (or download from [here](https://github.ibm.com/spartha/READ/archive/master.zip))
  * ```cd READ```
  * ```npm install --no-optional```
3. Configure
  * Edit ```READ/config.js``` with appropriate host and port information for read, gdp and cf services
4. Run the sample application
  * Start the Generic Data Panel (GDP) Service
    + ```cd READ/gdp```
    + ```node gdp```
  * Start the Crossfilter (CF) Service
    + ```cd READ/cf```
    + ```node cf```
  * Start the READ service
    + ```cd READ/flowboards/backend/```
    + ```node read```
  * (Optional)  Set up Node-RED and configure the Node-RED dependent portions of the sample app
        packaged with READ by following the instructions in the user guide: http://localhost:8000/#/docs/userguide (note:
        replace localhost with read.host and 8000 with read.port from config.js)
  * Visit READ at http://localhost:8000
5. Next steps
  * Read the READ User Guide: http://localhost:8000/#/docs/userguide
