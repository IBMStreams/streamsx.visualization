export default visualizations = 
[{
	"_id": "BwZfNB4hc4nWyYSwS",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "Sine and Cos Lines",
	"templateId": "GrjTHgAnhoWDy748u",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 0,
		"y": 20,
		"height": 5,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"sin2\", \"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'lineChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d){ return d.x; },\n        y: function(d){ return d.y; },\n        useInteractiveGuideline: true,\n        xAxis: {\n            axisLabel: 'Time (ms)' \n        },\n        yAxis: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('.02f')(d);\n            },\n            axisLabelDistance: -10\n        }\n    }\n}"
},
{
	"_id": "FYPdv7MiGcWN72KPu",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "Sine and Cos Bars",
	"templateId": "Xn4ccaMAyjhPvoi6Q",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 6,
		"y": 20,
		"height": 5,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"sin2\", \"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'multiBarChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d){ return d.x; },\n        y: function(d){ return d.y; },\n        stacked: true,\n        color: d3.scale.category10().range(),\n        xAxis: {\n            axisLabel: 'Time (ms)' \n        },\n        yAxis: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('.02f')(d);\n            },\n            axisLabelDistance: -10\n        }\n    }\n}"
},
{
	"_id": "h7fSZBZQSyWgWntSY",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "Sine and Cos Area",
	"templateId": "yamb5aiocevMP22Kw",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 7,
		"y": 9,
		"height": 6,
		"width": 5
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"sin2\", \"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'stackedAreaChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d){ return d.x; },\n        y: function(d){ return d.y; },\n        useInteractiveGuideline: true,\n        color: d3.scale.category10().range(),\n        xAxis: {\n            axisLabel: 'Time (ms)' \n        },\n        yAxis: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('.02f')(d);\n            },\n            axisLabelDistance: -10\n        }\n    }\n}"
},
{
	"_id": "FhNKEAyDKvo9WEwfG",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "SC Line Focus",
	"templateId": "pSnnc8dd9XQbMCxed",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 0,
		"y": 15,
		"height": 5,
		"width": 12
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"sin2\", \"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'lineWithFocusChart',\n        margin : {\n            top: 20,\n            right: 20,\n            bottom: 60,\n            left: 40\n        },\n        duration: 500,\n        color: d3.scale.category10().range(),\n        useInteractiveGuideline: true,\n        xAxis: {\n            axisLabel: 'X Axis',\n            tickFormat: function(d){\n                return d3.format(',f')(d);\n            }\n        },\n        x2Axis: {\n            tickFormat: function(d){\n                return d3.format(',f')(d);\n            }\n        },\n        yAxis: {\n            axisLabel: 'Y Axis',\n            tickFormat: function(d){\n                return d3.format(',.2f')(d);\n            },\n            rotateYLabel: false\n        },\n        y2Axis: {\n            tickFormat: function(d){\n                return d3.format(',.2f')(d);\n            }\n        }\n    }\n}"
},
{
	"_id": "MHZL8TCjoMgEuqa5H",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "SC Bars Focus",
	"templateId": "CqqDiMcWzd8wa2sq7",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 0,
		"y": 9,
		"height": 6,
		"width": 7
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"sin2\"],\n    barKeys: [\"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'linePlusBarChart',\n        margin: {\n            top: 30,\n            right: 40,\n            bottom: 50,\n            left: 50\n        },\n        bars: {\n            forceY: [0]\n        },\n        bars2: {\n            forceY: [0]\n        },\n        color: d3.scale.category10().range(),\n        x: function(d,i) { return i },\n        xAxis: {\n            axisLabel: 'X Axis'\n        },\n        x2Axis: {\n            showMaxMin: false\n        },\n        y1Axis: {\n            axisLabel: 'Y1 Axis',\n            tickFormat: function(d){\n                return d3.format('0.2f')(d);\n            },\n            axisLabelDistance: -15\n        },\n        y2Axis: {\n            axisLabel: 'Y2 Axis',\n            tickFormat: function(d) {\n                return d3.format(',.2f')(d)\n            }\n        },\n        y3Axis: {\n            tickFormat: function(d){\n                return d3.format(',f')(d);\n            }\n        },\n        y4Axis: {\n            tickFormat: function(d) {\n                return d3.format(',.2f')(d)\n            }\n        }\n    }\n}"
},
{
	"_id": "hfRTCNmfwK7XKSGpg",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "Sine and Cos Spark",
	"templateId": "829EXba3uCBzmCKcQ",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 6,
		"y": 6,
		"height": 3,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKey: \"cos\"\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'sparklinePlus',\n        x: function(d, i){return i;},\n        duration: 250\n    }\n}"
},
{
	"_id": "thhhzrsW4nXur2MRY",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "SC Multi",
	"templateId": "zAnReEZadoCj5aobp",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 0,
		"y": 5,
		"height": 4,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [{\n        \"key\": \"sin\",\n        \"type\": \"bar\",\n        \"yAxis\": 1\n    }, {\n        \"key\": \"sin2\",\n        \"type\": \"line\",\n        \"yAxis\": 2\n    }, {\n        \"key\": \"cos\",\n        \"type\": \"area\",\n        \"yAxis\": 1\n    }],\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'multiChart',\n        margin : {\n            top: 30,\n            right: 60,\n            bottom: 50,\n            left: 70\n        },\n        color: d3.scale.category10().range(),\n        useInteractiveGuideline: true,\n        duration: 500,\n        xAxis: {\n            tickFormat: function(d){\n                return d3.format(',f')(d);\n            }\n        },\n        yAxis1: {\n            tickFormat: function(d){\n                return d3.format(',.1f')(d);\n            }\n        },\n        yAxis2: {\n            tickFormat: function(d){\n                return d3.format(',.1f')(d);\n            }\n        }\n    }\n}"
},
{
	"_id": "Ags8kgJzdgeEwTs5q",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "SC Cumulative",
	"templateId": "es9Nz75aDjZRmW4JY",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 6,
		"y": 0,
		"height": 6,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"sin2\", \"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'cumulativeLineChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d){ return d.x; },\n        y: function(d){ return d.y; },\n        useInteractiveGuideline: true,\n        xAxis: {\n            axisLabel: 'Time (ms)' \n        },\n        yAxis: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('.02f')(d);\n            },\n            axisLabelDistance: -10\n        }\n    }\n}"
},
{
	"_id": "uCrjw5b7Zo9ysRNyM",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"name": "SC Historic",
	"templateId": "wrKoL5GZyRFHErakp",
	"pluginType": "NVD3",
	"dataSetId": "y68h9Lziqtr7E6Nz8",
	"gridStack": {
		"x": 0,
		"y": 0,
		"height": 5,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"sin2\", \"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'historicalBarChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d){ return d.x; },\n        y: function(d){ return d.y; },\n        stacked: true,\n        color: d3.scale.category10().range(),\n        xAxis: {\n            axisLabel: 'Time (ms)' \n        },\n        yAxis: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('.02f')(d);\n            },\n            axisLabelDistance: -10\n        }\n    }\n}"
},
{
	"_id": "L9qoJqjJ4ZxFwWPTD",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"name": "Stateful Sine",
	"templateId": "Xn4ccaMAyjhPvoi6Q",
	"pluginType": "NVD3",
	"dataSetId": "GwS2d655YujxqfZCf",
	"gridStack": {
		"x": 6,
		"y": 0,
		"height": 6,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\", \"cos\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'multiBarChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d){ return new Date(d.x); },\n        y: function(d){ return d.y; },\n        useInteractiveGuideline: true,\n        color: d3.scale.category10().range(),\n        xAxis: {\n            axisLabel: 'Time (ms)',\n            tickFormat: function(d){\n                return d3.time.format('%M:%S')(new Date(d)); //uncomment for date format\n            }\n        },\n        yAxis: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('.02f')(d);\n            },\n            axisLabelDistance: -10\n        }\n    }\n}"
},
{
	"_id": "RyzZEQwRChaD9i4ez",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "Horsepower Vs Weight",
	"templateId": "RYoPMm5p7Cpk5z4ST",
	"pluginType": "NVD3",
	"dataSetId": "dYvhhokemueLhytDX",
	"gridStack": {
		"x": 0,
		"y": 18,
		"height": 7,
		"width": 12
	},
	"basicOptions": "{\n    xKey:\"horsepower\",\n    yKey: \"weight\",\n    groupKey: \"origin\",\n    shapeKey: \"origin\"\n}",
	"advancedOptions": "{\n  chart: {\n    type: \"scatterChart\",\n    margin: {\n        top: 20, \n        right: 30, \n        bottom: 40,\n        left: 60\n    },\n    scatter: {\n      onlyCircles: false\n    },\n    showLegend: true,\n    showDistX: true,\n    showDistY: true,\n    color: d3.scale.category10().range(),\n    duration: 350,\n    xAxis: {\n      axisLabel: \"Horsepower\"\n    },\n    yAxis: {\n      axisLabel: \"Weight\",\n      axisLabelDistance: -5\n    },\n    tooltip: {\n       contentGenerator: d =\u003e d.point.row.name\n    },\n    pointRange: [200, 200],\n    zoom: {\n      enabled: false\n    }\n  }\n}"
},
{
	"_id": "ZjdjX8qDR8mmc2WEq",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "Filtered Cars",
	"templateId": "SwHc4jsxviCwNXaz3",
	"pluginType": "NVD3",
	"dataSetId": "dYvhhokemueLhytDX",
	"gridStack": {
		"x": 0,
		"y": 25,
		"height": 5,
		"width": 12
	},
	"basicOptions": "[]",
	"advancedOptions": "\n{\n    chart: {\n        type: 'parallelCoordinates',\n        margin: {\n            top: 25,\n            right: 0,\n            bottom: 10,\n            left: 0\n        },\n        dimensions: [\"mpg\", \"cylinders\", \"engine\", \"horsepower\", \"weight\", \"acceleration\", \"year\"]\n    }\n}"
},
{
	"_id": "u85BxWSmi62CaSwde",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "HP Candlesticks",
	"templateId": "kQjX6Fr9cbyssN3kp",
	"pluginType": "NVD3",
	"dataSetId": "gbKpr34hdTFzXzFdQ",
	"gridStack": {
		"x": 6,
		"y": 0,
		"height": 6,
		"width": 6
	},
	"basicOptions": "\n{\n    xKey: \"year\",\n    openKey: \"firstQ\",\n    closeKey: \"thirdQ\",\n    highKey: \"max\",\n    lowKey: \"min\"\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'candlestickBarChart',\n        margin : {\n            top: 20,\n            right: 20,\n            bottom: 40,\n            left: 60\n        },\n        y: function(d){\n            return d['close'];\n        },\n        xAxis: {\n            axisLabel: 'Years'\n        },\n        yAxis: {\n            axisLabel: 'Horsepower'\n        }\n    }\n}"
},
{
	"_id": "j4JXP5R6SrKTdx646",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "HP OHLC",
	"templateId": "yFk6yJJ8XBtm29tmE",
	"pluginType": "NVD3",
	"dataSetId": "gbKpr34hdTFzXzFdQ",
	"gridStack": {
		"x": 6,
		"y": 12,
		"height": 5,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"year\",\n    openKey: \"firstQ\",\n    closeKey: \"thirdQ\",\n    highKey: \"max\",\n    lowKey: \"min\"\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'ohlcBarChart',\n        margin : {\n            top: 20,\n            right: 20,\n            bottom: 40,\n            left: 60\n        },\n        y: function(d){\n            return d['close'];\n        },\n        xAxis: {\n            axisLabel: 'Years'\n        },\n        yAxis: {\n            axisLabel: 'Horsepower'\n        }\n    }\n}"
},
{
	"_id": "rHH2KETBJYNz4m6A2",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "Cars by Year",
	"templateId": "nfsnypDLpBEnLmrGF",
	"pluginType": "NVD3",
	"dataSetId": "JaNmzZhzkDA5DBSth",
	"gridStack": {
		"x": 0,
		"y": 6,
		"height": 6,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"year\",\n    yKey: \"count\"\n}",
	"advancedOptions": "\n{\n  \"chart\": {\n    \"type\": \"pieChart\",\n    \"margin\": {\n        \"top\": 0, \n        \"right\": 0, \n        \"bottom\": 0,\n        \"left\": 0\n    },\n    legend: {\n        \"margin\": {\n            \"top\": 10, \n            \"right\": 10, \n            \"bottom\": 0,\n            \"left\": 10\n        },        \n    },\n    \"donut\": true,\n    \"showLabels\": true,\n    \"duration\": 500,\n    \"labelThreshold\": 0.02,\n    \"labelSunbeamLayout\": true\n  }\n}"
},
{
	"_id": "A4wTHswxjrQkB8vys",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "Cars by Origin",
	"templateId": "nfsnypDLpBEnLmrGF",
	"pluginType": "NVD3",
	"dataSetId": "uErToyy7uWJ266dPj",
	"gridStack": {
		"x": 0,
		"y": 12,
		"height": 6,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"origin\",\n    yKey: \"count\"\n}",
	"advancedOptions": "{\n  \"chart\": {\n    \"type\": \"pieChart\",\n    \"margin\": {\n        \"top\": 20, \n        \"right\": 20, \n        \"bottom\": 20,\n        \"left\": 20\n    },\n    \"showLabels\": true,\n    \"duration\": 500,\n    \"labelThreshold\": 0.02,\n    \"labelSunbeamLayout\": true\n  }\n}"
},
{
	"_id": "TWp65LpLmm7i5XFjR",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "Sunburst",
	"templateId": "sph679MRCMDiM4LJC",
	"pluginType": "NVD3",
	"dataSetId": "Y537oqhDPBegPQPbK",
	"gridStack": {
		"x": 0,
		"y": 0,
		"height": 6,
		"width": 6
	},
	"basicOptions": "{}",
	"advancedOptions": "{\n    chart: {\n        type: 'sunburstChart',\n        margin: {\n            top: 30,\n            bottom: 0, \n            left: 0,\n            right: 0\n        },\n        color: d3.scale.category20c(),\n        showLabels: true,\n        labelThreshold: 0.5,\n        duration: 250\n    }\n}"
},
{
	"_id": "v2xoZNpfdBBHM2Ett",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Toner",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "JhLqiLWZMxis3LxJP",
	"gridStack": {
		"x": 0,
		"y": 17,
		"height": 12,
		"width": 6
	}
},
{
	"_id": "77pPJDTYnGGc8dXcv",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Terrain",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "wm4dSc6Fc5NR3LgpG",
	"gridStack": {
		"x": 0,
		"y": 29,
		"height": 5,
		"width": 12
	}
},
{
	"_id": "DjWrieXCPZuqxpFpz",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Water Color",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "YvWS38emFZgZ92DRN",
	"gridStack": {
		"x": 6,
		"y": 0,
		"height": 8,
		"width": 6
	}
},
{
	"_id": "crPBxsBKaeroW6yGq",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Legend",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "6gZNShwCFcMCptQ2H",
	"gridStack": {
		"x": 0,
		"y": 5,
		"height": 6,
		"width": 6
	}
},
{
	"_id": "gpvzLtxTvTLCxADfR",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Geo JSON",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "XtsxDSh3BL8pGvqNQ",
	"gridStack": {
		"x": 6,
		"y": 20,
		"height": 9,
		"width": 6
	}
},
{
	"_id": "7nptNJ6b9XKgdedYu",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Bounds",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "NNQ9r4tYyXLJfWzyK",
	"gridStack": {
		"x": 6,
		"y": 8,
		"height": 8,
		"width": 6
	}
},
{
	"_id": "oQxMgFJvH68gXJArZ",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Max Bounds",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "tEheoTBzYnS3ZBKpQ",
	"gridStack": {
		"x": 0,
		"y": 11,
		"height": 6,
		"width": 6
	}
},
{
	"_id": "PZ57T6FWLmkNQ8SYE",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "IP Geo Location",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "hXmDDYqcTet6XwhKa",
	"gridStack": {
		"x": 0,
		"y": 0,
		"height": 5,
		"width": 6
	}
},
{
	"_id": "ecDTkT9PC7rfQoCSY",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Layers",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "5oJFX5SxWexTCD9ca",
	"gridStack": {
		"x": 6,
		"y": 34,
		"height": 6,
		"width": 6
	}
},
{
	"_id": "4Fy3fG8Xjpa7SGEvD",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Paths",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "iEahWn8fycZDsGjfZ",
	"gridStack": {
		"x": 0,
		"y": 34,
		"height": 6,
		"width": 6
	}
},
{
	"_id": "fNxikntSNTPpnunKj",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"name": "Tiles",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "oZF4xTTraiir4avX6",
	"gridStack": {
		"x": 6,
		"y": 16,
		"height": 4,
		"width": 6
	}
},
{
	"_id": "bEhyQppynjZRGLJxe",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"name": "Noisy sine",
	"templateId": "GrjTHgAnhoWDy748u",
	"pluginType": "NVD3",
	"dataSetId": "d7kBgpXTTwYLCrXMg",
	"gridStack": {
		"x": 0,
		"y": 6,
		"height": 5,
		"width": 12
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [\"sin\"]\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'lineChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d, i){ return  i;}\n,        y: function(d){ return d.y; },\n        useInteractiveGuideline: true,\n        xAxis: {\n            axisLabel: 'Time (ms)',\n            ticks: 25,\n            tickFormat: function(d) {\n                return null;\n                return d3.time.format('%M:%S')(new Date(d)); //uncomment for date format\n            }\n        },\n        yAxis: {\n            ticks: 25,\n            axisLabel: 'Voltage (v)',\n            axisLabelDistance: -10\n        },\n        yDomain: [-2, 2]\n    }\n}"
},
{
	"_id": "s6R2XQYMkBgYmhtA2",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"name": "Boxplot",
	"templateId": "FdxAqyQjJLMHtFQBJ",
	"pluginType": "NVD3",
	"dataSetId": "384vc72q4fyELKjNq",
	"gridStack": {
		"x": 6,
		"y": 6,
		"height": 6,
		"width": 6
	},
	"basicOptions": "{}",
	"advancedOptions": "{\n    chart: {\n        type: 'boxPlotChart',\n        margin: {\n            top: 20, \n            right: 20, \n            bottom: 40,\n            left: 60\n        },\n        x: function(d){ return d.label; },\n        useInteractiveGuideline: true,\n        xAxis: {\n            axisLabel: 'Experiments' \n        },\n        yAxis: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('.02f')(d);\n            },\n            axisLabelDistance: -5\n        }\n    }\n}"
},
{
	"_id": "MBd33qz5ZzXMuqYha",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"name": "Sine Cos Tan",
	"templateId": "zAnReEZadoCj5aobp",
	"pluginType": "NVD3",
	"dataSetId": "E5orNmqqHhBsKFduX",
	"gridStack": {
		"x": 0,
		"y": 11,
		"height": 6,
		"width": 6
	},
	"basicOptions": "{\n    xKey: \"time\",\n    yKeys: [{\n        \"key\": \"sin\",\n        \"type\": \"bar\",\n        \"yAxis\": 1\n    }, {\n        \"key\": \"cos\",\n        \"type\": \"area\",\n        \"yAxis\": 1\n    }, {\n        \"key\": \"tan\",\n        \"type\": \"line\",\n        \"yAxis\": 2\n    }],\n}",
	"advancedOptions": "{\n    chart: {\n        type: 'multiChart',\n        margin: {\n            top: 20, \n            right: 40, \n            bottom: 40,\n            left: 55\n        },\n        x: function(d){ return new Date(d.x); },\n        y: function(d){ return d.y.toFixed(2); },\n        useInteractiveGuideline: true,\n        color: d3.scale.category10().range(),\n        xAxis: {\n            axisLabel: 'Time (ms)',\n            tickFormat: function(d){\n                return d3.time.format('%M:%S')(new Date(d)); //uncomment for date format\n            }\n        },\n        yDomain1: [-1, 1],\n        yDomain2: [-5, 5],\n        yAxis1: {\n            axisLabel: 'Voltage (v)',\n            tickFormat: function(d) {\n                return d3.format('0.02f')(d);\n            },\n            axisLabelDistance: -10\n        },\n        yAxis2: {\n            tickFormat: function(d) {\n                return d3.format('0.02f')(d);\n            }\n        }\n     }\n}"
},
{
	"_id": "JRP8GczpGh6tE6e8t",
	"userId": "guest",
	"appId": "Q4EnorTFxvG9gyHyB",
	"dashboardId": "7kGXWA8K4yM55PCji",
	"name": "HTTPTupleView",
	"templateId": "zAnReEZadoCj5aobp",
	"pluginType": "NVD3",
	"dataSetId": "5jGmc6gN3PLiD7GBo",
	"gridStack": {
		"x": 0,
		"y": 0,
		"height": 4,
		"width": 12
	},
	"basicOptions": "{\n    \"xKey\": \"timeStamp\",\n    \"yKeys\": [{\n        \"key\": \"sine\",\n        \"type\": \"area\",\n        \"yAxis\": 1\n    }, {\n        \"key\": \"cos\",\n        \"type\": \"area\",\n        \"yAxis\": 2\n    }],\n}",
	"advancedOptions": "{\n    'chart': {\n        'type': 'multiChart',\n        'margin' : {\n            'top': 20,\n            'right': 40,\n            'bottom': 40,\n            'left': 55\n        },\n        'color': d3.scale.category10().range(),\n        'useInteractiveGuideline': true,\n        'duration': 500,\n        'xAxis': {\n            'axisLabel': 'Time (ms)',\n            'tickFormat': function(d){\n                return d3.format(',f')(d);\n            }\n        },\n        'yAxis1': {\n            'axisLabel': 'Value',\n            'tickFormat': function(d){\n                return d3.format('.02f')(d);\n            },\n            'axisLabelDistance': -10\n        },\n        'yAxis2': {\n            'tickFormat': function(d){\n                return d3.format('.02f')(d);\n            }\n        }\n    }\n}"
},
{
	"_id": "a6dKnmAkcKJnPkfH6",
	"userId": "guest",
	"appId": "Q4EnorTFxvG9gyHyB",
	"dashboardId": "7kGXWA8K4yM55PCji",
	"name": "WebSocket",
	"templateId": "GrjTHgAnhoWDy748u",
	"pluginType": "NVD3",
	"dataSetId": "TwfSXQpWjbfZzJRdZ",
	"gridStack": {
		"x": 0,
		"y": 4,
		"height": 4,
		"width": 12
	},
	"basicOptions": "{\n    \"xKey\": \"timeStamp\",\n    \"yKeys\": [\"sine\", \"cos\"]\n}",
	"advancedOptions": "{\n    'chart': {\n        'type': 'lineChart',\n        'margin': {\n            'top': 20, \n            'right': 40, \n            'bottom': 40,\n            'left': 55\n        },\n        'x': function(d){ return d.x; },\n        'y': function(d){ return d.y; },\n        'useInteractiveGuideline': true,\n        'xAxis': {\n            'axisLabel': 'Time (ms)',\n            'tickFormat': function(d){\n                return d3.format(',f')(d);\n            }\n        },\n        'yAxis': {\n            'axisLabel': 'Value',\n            'tickFormat': function(d) {\n                return d3.format('.02f')(d);\n            },\n            'axisLabelDistance': -10\n        },\n        'color': function (d, i) {\n            var myColors = ['#1f77b4', '#d62728'];\n            return myColors[i];\n        }\n    }\n}"
},
{
	"_id": "YWkThmxuc8tHAEkN5",
	"userId": "guest",
	"appId": "Q4EnorTFxvG9gyHyB",
	"dashboardId": "7kGXWA8K4yM55PCji",
	"name": "View Annotation",
	"templateId": "GrjTHgAnhoWDy748u",
	"pluginType": "NVD3",
	"dataSetId": "QWvddJfeSQguPZA62",
	"gridStack": {
		"x": 0,
		"y": 8,
		"height": 4,
		"width": 12
	},
	"basicOptions": "{\n    \"xKey\": \"timeStamp\",\n    \"yKeys\": [\"sine\", \"cos\"]\n}",
	"advancedOptions": "{\n    'chart': {\n        'type': 'lineChart',\n        'margin': {\n            'top': 20, \n            'right': 40, \n            'bottom': 40,\n            'left': 55\n        },\n        'x': function(d){ return d.x; },\n        'y': function(d){ return d.y; },\n        'useInteractiveGuideline': true,\n        'xAxis': {\n            'axisLabel': 'Time (ms)',\n            'tickFormat': function(d){\n                return d3.format(',f')(d);\n            }\n        },\n        'yAxis': {\n            'axisLabel': 'Value',\n            'tickFormat': function(d) {\n                return d3.format('.02f')(d);\n            },\n            'axisLabelDistance': -10\n        },\n        'color': function (d, i) {\n            var myColors = ['red', 'green'];\n            return myColors[i];\n        }\n    }\n}"
},
{
	"_id": "c3hzWwqRLvD8wfFdX",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"name": "Dynamic Map Marker",
	"templateId": "8Y4beRBmJvL9dFJLt",
	"pluginType": "leaflet",
	"dataSetId": "CiPuWcxfjAJ4zkiFy",
	"gridStack": {
		"x": 0,
		"y": 0,
		"height": 6,
		"width": 6
	}
}]

