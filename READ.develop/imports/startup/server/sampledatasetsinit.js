export default datasets = 
[{
	"_id": "y68h9Lziqtr7E6Nz8",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "CTyzoHgRxeFpnK29Y",
	"dataSetType": "simpleHTTP",
	"name": "Sine and Cos",
	"url": "https://gist.githubusercontent.com/sriumcp/5ca15b9e9b8c51db99cbbadc12047831/raw/b071553834d3c48c0bdde7cced6b2e126040e627/sinecos",
	"poll": {
		"enabled": false,
		"intervalSec": 20
	},
	"selectedVisualizationId": "uCrjw5b7Zo9ysRNyM"
},
{
	"_id": "QWF74B2tAs5LRspSz",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"dataSetType": "simpleHTTP",
	"name": "Dynamic Sine",
	"url": "http://readnodered.mybluemix.net/sampleapp/dynamicsine",
	"poll": {
		"enabled": true,
		"intervalSec": 3
	}
},
{
	"_id": "GwS2d655YujxqfZCf",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"dataSetType": "transformed",
	"name": "Stateful Sine",
	"parents": [
		"QWF74B2tAs5LRspSz"
	],
	"transformFunction": "(x, s) =\u003e {\n    if (s.length === 20) s.splice(0, 1)\n    x.hello = 'world';\n    s.push(x);\n    return s;\n}",
	"stateParams": {
		"enabled": true,
		"state": "[]"
	},
	"selectedVisualizationId": "9vpjXMYfudC4wjF9o"
},
{
	"_id": "dYvhhokemueLhytDX",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"dataSetType": "simpleHTTP",
	"name": "Cars",
	"url": "https://gist.githubusercontent.com/sriumcp/ebe66fbd4bb1f5b16feb0a9e7543f1b5/raw/5fda9a1537b75b1c059b9ce89ee309858dcba737/cars",
	"poll": {
		"enabled": false,
		"intervalSec": 20
	},
	"selectedVisualizationId": "RyzZEQwRChaD9i4ez"
},
{
	"_id": "gbKpr34hdTFzXzFdQ",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"dataSetType": "transformed",
	"name": "HP Over Years",
	"parents": [
		"dYvhhokemueLhytDX"
	],
	"transformFunction": "x =\u003e {\n    let carsByYear = _.groupBy(x, 'year');\n    return Object.keys(carsByYear).map(y =\u003e {\n        let hpForYear = _.filter(_.pluck(carsByYear[y], \"horsepower\"), x =\u003e _.isNumber(x)).sort((a, b) =\u003e a - b);\n        return {\n            year: y,\n            min: Math.min(...hpForYear),\n            max: Math.max(...hpForYear),\n            firstQ: hpForYear[Math.floor(hpForYear.length*0.25)],\n            thirdQ: hpForYear[Math.ceil(hpForYear.length*0.75)]\n            }\n        });\n    return y;\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "j4JXP5R6SrKTdx646"
},
{
	"_id": "JaNmzZhzkDA5DBSth",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"dataSetType": "transformed",
	"name": "Cars by Year",
	"parents": [
		"dYvhhokemueLhytDX"
	],
	"transformFunction": "x =\u003e {\n    let carsByYear = _.countBy(x, 'year');\n    let cby = Object.keys(carsByYear).map(z =\u003e {\n        return {\n            year: z,\n            count: carsByYear[z]\n        };\n    })\n    return cby;\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "rHH2KETBJYNz4m6A2"
},
{
	"_id": "uErToyy7uWJ266dPj",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"dataSetType": "transformed",
	"name": "Cars by Origin",
	"parents": [
		"dYvhhokemueLhytDX"
	],
	"transformFunction": "x =\u003e {\n    let carsByOrigin = _.countBy(x, 'origin');\n    let cbo = Object.keys(carsByOrigin).map(z =\u003e {\n        return {\n            origin: z,\n            count: carsByOrigin[z]\n        };\n    })\n    return cbo;\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "A4wTHswxjrQkB8vys"
},
{
	"_id": "Y537oqhDPBegPQPbK",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "RFznYoGe3ETKsGLQz",
	"dataSetType": "raw",
	"name": "Sunburst dataset",
	"rawData": "[{\n            \"name\": \"flare\",\n            \"children\": [\n                {\n                    \"name\": \"analytics\",\n                    \"children\": [\n                        {\n                            \"name\": \"cluster\",\n                            \"children\": [\n                                {\"name\": \"AgglomerativeCluster\", \"size\": 3938},\n                                {\"name\": \"CommunityStructure\", \"size\": 3812},\n                                {\"name\": \"HierarchicalCluster\", \"size\": 6714},\n                                {\"name\": \"MergeEdge\", \"size\": 743}\n                            ]\n                        },\n                        {\n                            \"name\": \"graph\",\n                            \"children\": [\n                                {\"name\": \"BetweennessCentrality\", \"size\": 3534},\n                                {\"name\": \"LinkDistance\", \"size\": 5731},\n                                {\"name\": \"MaxFlowMinCut\", \"size\": 7840},\n                                {\"name\": \"ShortestPaths\", \"size\": 5914},\n                                {\"name\": \"SpanningTree\", \"size\": 3416}\n                            ]\n                        },\n                        {\n                            \"name\": \"optimization\",\n                            \"children\": [\n                                {\"name\": \"AspectRatioBanker\", \"size\": 7074}\n                            ]\n                        }\n                    ]\n                },\n                {\n                    \"name\": \"animate\",\n                    \"children\": [\n                        {\"name\": \"Easing\", \"size\": 17010},\n                        {\"name\": \"FunctionSequence\", \"size\": 5842},\n                        {\n                            \"name\": \"interpolate\",\n                            \"children\": [\n                                {\"name\": \"ArrayInterpolator\", \"size\": 1983},\n                                {\"name\": \"ColorInterpolator\", \"size\": 2047},\n                                {\"name\": \"DateInterpolator\", \"size\": 1375},\n                                {\"name\": \"Interpolator\", \"size\": 8746},\n                                {\"name\": \"MatrixInterpolator\", \"size\": 2202},\n                                {\"name\": \"NumberInterpolator\", \"size\": 1382},\n                                {\"name\": \"ObjectInterpolator\", \"size\": 1629},\n                                {\"name\": \"PointInterpolator\", \"size\": 1675},\n                                {\"name\": \"RectangleInterpolator\", \"size\": 2042}\n                            ]\n                        },\n                        {\"name\": \"ISchedulable\", \"size\": 1041},\n                        {\"name\": \"Parallel\", \"size\": 5176},\n                        {\"name\": \"Pause\", \"size\": 449},\n                        {\"name\": \"Scheduler\", \"size\": 5593},\n                        {\"name\": \"Sequence\", \"size\": 5534},\n                        {\"name\": \"Transition\", \"size\": 9201},\n                        {\"name\": \"Transitioner\", \"size\": 19975},\n                        {\"name\": \"TransitionEvent\", \"size\": 1116},\n                        {\"name\": \"Tween\", \"size\": 6006}\n                    ]\n                },\n                {\n                    \"name\": \"data\",\n                    \"children\": [\n                        {\n                            \"name\": \"converters\",\n                            \"children\": [\n                                {\"name\": \"Converters\", \"size\": 721},\n                                {\"name\": \"DelimitedTextConverter\", \"size\": 4294},\n                                {\"name\": \"GraphMLConverter\", \"size\": 9800},\n                                {\"name\": \"IDataConverter\", \"size\": 1314},\n                                {\"name\": \"JSONConverter\", \"size\": 2220}\n                            ]\n                        },\n                        {\"name\": \"DataField\", \"size\": 1759},\n                        {\"name\": \"DataSchema\", \"size\": 2165},\n                        {\"name\": \"DataSet\", \"size\": 586},\n                        {\"name\": \"DataSource\", \"size\": 3331},\n                        {\"name\": \"DataTable\", \"size\": 772},\n                        {\"name\": \"DataUtil\", \"size\": 3322}\n                    ]\n                },\n                {\n                    \"name\": \"display\",\n                    \"children\": [\n                        {\"name\": \"DirtySprite\", \"size\": 8833},\n                        {\"name\": \"LineSprite\", \"size\": 1732},\n                        {\"name\": \"RectSprite\", \"size\": 3623},\n                        {\"name\": \"TextSprite\", \"size\": 10066}\n                    ]\n                },\n                {\n                    \"name\": \"flex\",\n                    \"children\": [\n                        {\"name\": \"FlareVis\", \"size\": 4116}\n                    ]\n                },\n                {\n                    \"name\": \"physics\",\n                    \"children\": [\n                        {\"name\": \"DragForce\", \"size\": 1082},\n                        {\"name\": \"GravityForce\", \"size\": 1336},\n                        {\"name\": \"IForce\", \"size\": 319},\n                        {\"name\": \"NBodyForce\", \"size\": 10498},\n                        {\"name\": \"Particle\", \"size\": 2822},\n                        {\"name\": \"Simulation\", \"size\": 9983},\n                        {\"name\": \"Spring\", \"size\": 2213},\n                        {\"name\": \"SpringForce\", \"size\": 1681}\n                    ]\n                },\n                {\n                    \"name\": \"query\",\n                    \"children\": [\n                        {\"name\": \"AggregateExpression\", \"size\": 1616},\n                        {\"name\": \"And\", \"size\": 1027},\n                        {\"name\": \"Arithmetic\", \"size\": 3891},\n                        {\"name\": \"Average\", \"size\": 891},\n                        {\"name\": \"BinaryExpression\", \"size\": 2893},\n                        {\"name\": \"Comparison\", \"size\": 5103},\n                        {\"name\": \"CompositeExpression\", \"size\": 3677},\n                        {\"name\": \"Count\", \"size\": 781},\n                        {\"name\": \"DateUtil\", \"size\": 4141},\n                        {\"name\": \"Distinct\", \"size\": 933},\n                        {\"name\": \"Expression\", \"size\": 5130},\n                        {\"name\": \"ExpressionIterator\", \"size\": 3617},\n                        {\"name\": \"Fn\", \"size\": 3240},\n                        {\"name\": \"If\", \"size\": 2732},\n                        {\"name\": \"IsA\", \"size\": 2039},\n                        {\"name\": \"Literal\", \"size\": 1214},\n                        {\"name\": \"Match\", \"size\": 3748},\n                        {\"name\": \"Maximum\", \"size\": 843},\n                        {\n                            \"name\": \"methods\",\n                            \"children\": [\n                                {\"name\": \"add\", \"size\": 593},\n                                {\"name\": \"and\", \"size\": 330},\n                                {\"name\": \"average\", \"size\": 287},\n                                {\"name\": \"count\", \"size\": 277},\n                                {\"name\": \"distinct\", \"size\": 292},\n                                {\"name\": \"div\", \"size\": 595},\n                                {\"name\": \"eq\", \"size\": 594},\n                                {\"name\": \"fn\", \"size\": 460},\n                                {\"name\": \"gt\", \"size\": 603},\n                                {\"name\": \"gte\", \"size\": 625},\n                                {\"name\": \"iff\", \"size\": 748},\n                                {\"name\": \"isa\", \"size\": 461},\n                                {\"name\": \"lt\", \"size\": 597},\n                                {\"name\": \"lte\", \"size\": 619},\n                                {\"name\": \"max\", \"size\": 283},\n                                {\"name\": \"min\", \"size\": 283},\n                                {\"name\": \"mod\", \"size\": 591},\n                                {\"name\": \"mul\", \"size\": 603},\n                                {\"name\": \"neq\", \"size\": 599},\n                                {\"name\": \"not\", \"size\": 386},\n                                {\"name\": \"or\", \"size\": 323},\n                                {\"name\": \"orderby\", \"size\": 307},\n                                {\"name\": \"range\", \"size\": 772},\n                                {\"name\": \"select\", \"size\": 296},\n                                {\"name\": \"stddev\", \"size\": 363},\n                                {\"name\": \"sub\", \"size\": 600},\n                                {\"name\": \"sum\", \"size\": 280},\n                                {\"name\": \"update\", \"size\": 307},\n                                {\"name\": \"variance\", \"size\": 335},\n                                {\"name\": \"where\", \"size\": 299},\n                                {\"name\": \"xor\", \"size\": 354},\n                                {\"name\": \"_\", \"size\": 264}\n                            ]\n                        },\n                        {\"name\": \"Minimum\", \"size\": 843},\n                        {\"name\": \"Not\", \"size\": 1554},\n                        {\"name\": \"Or\", \"size\": 970},\n                        {\"name\": \"Query\", \"size\": 13896},\n                        {\"name\": \"Range\", \"size\": 1594},\n                        {\"name\": \"StringUtil\", \"size\": 4130},\n                        {\"name\": \"Sum\", \"size\": 791},\n                        {\"name\": \"Variable\", \"size\": 1124},\n                        {\"name\": \"Variance\", \"size\": 1876},\n                        {\"name\": \"Xor\", \"size\": 1101}\n                    ]\n                },\n                {\n                    \"name\": \"scale\",\n                    \"children\": [\n                        {\"name\": \"IScaleMap\", \"size\": 2105},\n                        {\"name\": \"LinearScale\", \"size\": 1316},\n                        {\"name\": \"LogScale\", \"size\": 3151},\n                        {\"name\": \"OrdinalScale\", \"size\": 3770},\n                        {\"name\": \"QuantileScale\", \"size\": 2435},\n                        {\"name\": \"QuantitativeScale\", \"size\": 4839},\n                        {\"name\": \"RootScale\", \"size\": 1756},\n                        {\"name\": \"Scale\", \"size\": 4268},\n                        {\"name\": \"ScaleType\", \"size\": 1821},\n                        {\"name\": \"TimeScale\", \"size\": 5833}\n                    ]\n                },\n                {\n                    \"name\": \"util\",\n                    \"children\": [\n                        {\"name\": \"Arrays\", \"size\": 8258},\n                        {\"name\": \"Colors\", \"size\": 10001},\n                        {\"name\": \"Dates\", \"size\": 8217},\n                        {\"name\": \"Displays\", \"size\": 12555},\n                        {\"name\": \"Filter\", \"size\": 2324},\n                        {\"name\": \"Geometry\", \"size\": 10993},\n                        {\n                            \"name\": \"heap\",\n                            \"children\": [\n                                {\"name\": \"FibonacciHeap\", \"size\": 9354},\n                                {\"name\": \"HeapNode\", \"size\": 1233}\n                            ]\n                        },\n                        {\"name\": \"IEvaluable\", \"size\": 335},\n                        {\"name\": \"IPredicate\", \"size\": 383},\n                        {\"name\": \"IValueProxy\", \"size\": 874},\n                        {\n                            \"name\": \"math\",\n                            \"children\": [\n                                {\"name\": \"DenseMatrix\", \"size\": 3165},\n                                {\"name\": \"IMatrix\", \"size\": 2815},\n                                {\"name\": \"SparseMatrix\", \"size\": 3366}\n                            ]\n                        },\n                        {\"name\": \"Maths\", \"size\": 17705},\n                        {\"name\": \"Orientation\", \"size\": 1486},\n                        {\n                            \"name\": \"palette\",\n                            \"children\": [\n                                {\"name\": \"ColorPalette\", \"size\": 6367},\n                                {\"name\": \"Palette\", \"size\": 1229},\n                                {\"name\": \"ShapePalette\", \"size\": 2059},\n                                {\"name\": \"SizePalette\", \"size\": 2291}\n                            ]\n                        },\n                        {\"name\": \"Property\", \"size\": 5559},\n                        {\"name\": \"Shapes\", \"size\": 19118},\n                        {\"name\": \"Sort\", \"size\": 6887},\n                        {\"name\": \"Stats\", \"size\": 6557},\n                        {\"name\": \"Strings\", \"size\": 22026}\n                    ]\n                },\n                {\n                    \"name\": \"vis\",\n                    \"children\": [\n                        {\n                            \"name\": \"axis\",\n                            \"children\": [\n                                {\"name\": \"Axes\", \"size\": 1302},\n                                {\"name\": \"Axis\", \"size\": 24593},\n                                {\"name\": \"AxisGridLine\", \"size\": 652},\n                                {\"name\": \"AxisLabel\", \"size\": 636},\n                                {\"name\": \"CartesianAxes\", \"size\": 6703}\n                            ]\n                        },\n                        {\n                            \"name\": \"controls\",\n                            \"children\": [\n                                {\"name\": \"AnchorControl\", \"size\": 2138},\n                                {\"name\": \"ClickControl\", \"size\": 3824},\n                                {\"name\": \"Control\", \"size\": 1353},\n                                {\"name\": \"ControlList\", \"size\": 4665},\n                                {\"name\": \"DragControl\", \"size\": 2649},\n                                {\"name\": \"ExpandControl\", \"size\": 2832},\n                                {\"name\": \"HoverControl\", \"size\": 4896},\n                                {\"name\": \"IControl\", \"size\": 763},\n                                {\"name\": \"PanZoomControl\", \"size\": 5222},\n                                {\"name\": \"SelectionControl\", \"size\": 7862},\n                                {\"name\": \"TooltipControl\", \"size\": 8435}\n                            ]\n                        },\n                        {\n                            \"name\": \"data\",\n                            \"children\": [\n                                {\"name\": \"Data\", \"size\": 20544},\n                                {\"name\": \"DataList\", \"size\": 19788},\n                                {\"name\": \"DataSprite\", \"size\": 10349},\n                                {\"name\": \"EdgeSprite\", \"size\": 3301},\n                                {\"name\": \"NodeSprite\", \"size\": 19382},\n                                {\n                                    \"name\": \"render\",\n                                    \"children\": [\n                                        {\"name\": \"ArrowType\", \"size\": 698},\n                                        {\"name\": \"EdgeRenderer\", \"size\": 5569},\n                                        {\"name\": \"IRenderer\", \"size\": 353},\n                                        {\"name\": \"ShapeRenderer\", \"size\": 2247}\n                                    ]\n                                },\n                                {\"name\": \"ScaleBinding\", \"size\": 11275},\n                                {\"name\": \"Tree\", \"size\": 7147},\n                                {\"name\": \"TreeBuilder\", \"size\": 9930}\n                            ]\n                        },\n                        {\n                            \"name\": \"events\",\n                            \"children\": [\n                                {\"name\": \"DataEvent\", \"size\": 2313},\n                                {\"name\": \"SelectionEvent\", \"size\": 1880},\n                                {\"name\": \"TooltipEvent\", \"size\": 1701},\n                                {\"name\": \"VisualizationEvent\", \"size\": 1117}\n                            ]\n                        },\n                        {\n                            \"name\": \"legend\",\n                            \"children\": [\n                                {\"name\": \"Legend\", \"size\": 20859},\n                                {\"name\": \"LegendItem\", \"size\": 4614},\n                                {\"name\": \"LegendRange\", \"size\": 10530}\n                            ]\n                        },\n                        {\n                            \"name\": \"operator\",\n                            \"children\": [\n                                {\n                                    \"name\": \"distortion\",\n                                    \"children\": [\n                                        {\"name\": \"BifocalDistortion\", \"size\": 4461},\n                                        {\"name\": \"Distortion\", \"size\": 6314},\n                                        {\"name\": \"FisheyeDistortion\", \"size\": 3444}\n                                    ]\n                                },\n                                {\n                                    \"name\": \"encoder\",\n                                    \"children\": [\n                                        {\"name\": \"ColorEncoder\", \"size\": 3179},\n                                        {\"name\": \"Encoder\", \"size\": 4060},\n                                        {\"name\": \"PropertyEncoder\", \"size\": 4138},\n                                        {\"name\": \"ShapeEncoder\", \"size\": 1690},\n                                        {\"name\": \"SizeEncoder\", \"size\": 1830}\n                                    ]\n                                },\n                                {\n                                    \"name\": \"filter\",\n                                    \"children\": [\n                                        {\"name\": \"FisheyeTreeFilter\", \"size\": 5219},\n                                        {\"name\": \"GraphDistanceFilter\", \"size\": 3165},\n                                        {\"name\": \"VisibilityFilter\", \"size\": 3509}\n                                    ]\n                                },\n                                {\"name\": \"IOperator\", \"size\": 1286},\n                                {\n                                    \"name\": \"label\",\n                                    \"children\": [\n                                        {\"name\": \"Labeler\", \"size\": 9956},\n                                        {\"name\": \"RadialLabeler\", \"size\": 3899},\n                                        {\"name\": \"StackedAreaLabeler\", \"size\": 3202}\n                                    ]\n                                },\n                                {\n                                    \"name\": \"layout\",\n                                    \"children\": [\n                                        {\"name\": \"AxisLayout\", \"size\": 6725},\n                                        {\"name\": \"BundledEdgeRouter\", \"size\": 3727},\n                                        {\"name\": \"CircleLayout\", \"size\": 9317},\n                                        {\"name\": \"CirclePackingLayout\", \"size\": 12003},\n                                        {\"name\": \"DendrogramLayout\", \"size\": 4853},\n                                        {\"name\": \"ForceDirectedLayout\", \"size\": 8411},\n                                        {\"name\": \"IcicleTreeLayout\", \"size\": 4864},\n                                        {\"name\": \"IndentedTreeLayout\", \"size\": 3174},\n                                        {\"name\": \"Layout\", \"size\": 7881},\n                                        {\"name\": \"NodeLinkTreeLayout\", \"size\": 12870},\n                                        {\"name\": \"PieLayout\", \"size\": 2728},\n                                        {\"name\": \"RadialTreeLayout\", \"size\": 12348},\n                                        {\"name\": \"RandomLayout\", \"size\": 870},\n                                        {\"name\": \"StackedAreaLayout\", \"size\": 9121},\n                                        {\"name\": \"TreeMapLayout\", \"size\": 9191}\n                                    ]\n                                },\n                                {\"name\": \"Operator\", \"size\": 2490},\n                                {\"name\": \"OperatorList\", \"size\": 5248},\n                                {\"name\": \"OperatorSequence\", \"size\": 4190},\n                                {\"name\": \"OperatorSwitch\", \"size\": 2581},\n                                {\"name\": \"SortOperator\", \"size\": 2023}\n                            ]\n                        },\n                        {\"name\": \"Visualization\", \"size\": 16540}\n                    ]\n                }\n            ]\n        }]",
	"selectedVisualizationId": "TWp65LpLmm7i5XFjR"
},
{
	"_id": "JhLqiLWZMxis3LxJP",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "raw",
	"name": "Toner",
	"rawData": "{\n    center: {\n        lat: 52.52,\n        lng: 13.40,\n        zoom: 4\n    },\n    markers: {\n        m1: {\n            lat: 52.52,\n            lng: 13.40\n        }\n    },\n    defaults: {\n        tileLayer: \"http://tile.stamen.com/toner/{z}/{x}/{y}.png\",\n        zoomControlPosition: 'topright',\n        tileLayerOptions: {\n            opacity: 0.9,\n            detectRetina: true,\n            reuseTiles: true,\n            attribution: '\u003ca href=\"http://www.stamen.com/\"\u003eStamen\u003c/a\u003e'\n        },\n        scrollWheelZoom: false\n    }\n}",
	"selectedVisualizationId": "v2xoZNpfdBBHM2Ett"
},
{
	"_id": "wm4dSc6Fc5NR3LgpG",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "raw",
	"name": "Terrain",
	"rawData": "{\n    center: {\n        lat: 52.52,\n        lng: 13.40,\n        zoom: 4\n    },\n    markers: {\n        m1: {\n            lat: 52.52,\n            lng: 13.40\n        }\n    },\n    defaults: {\n        tileLayer: \"http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg\",\n        zoomControlPosition: 'topright',\n        tileLayerOptions: {\n            opacity: 0.9,\n            detectRetina: true,\n            reuseTiles: true,\n            attribution: '\u003ca href=\"http://www.stamen.com/\"\u003eStamen\u003c/a\u003e'\n        },\n        scrollWheelZoom: false\n    }\n}",
	"selectedVisualizationId": "77pPJDTYnGGc8dXcv"
},
{
	"_id": "YvWS38emFZgZ92DRN",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "raw",
	"name": "Water Color",
	"rawData": "{\n    center: {\n        lat: 52.52,\n        lng: 13.40,\n        zoom: 4\n    },\n    markers: {\n        m1: {\n            lat: 52.52,\n            lng: 13.40\n        }\n    },\n    defaults: {\n        tileLayer: \"http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg\",\n        zoomControlPosition: 'topright',\n        tileLayerOptions: {\n            opacity: 0.9,\n            detectRetina: true,\n            reuseTiles: true,\n            attribution: '\u003ca href=\"http://www.stamen.com/\"\u003eStamen\u003c/a\u003e'\n        },\n        scrollWheelZoom: false\n    }\n}",
	"selectedVisualizationId": "DjWrieXCPZuqxpFpz"
},
{
	"_id": "6gZNShwCFcMCptQ2H",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "raw",
	"name": "Legend",
	"rawData": "{\n    center: {\n        lat: 51.505,\n        lng: -0.09,\n        zoom: 12\n    },\n    legend: {\n        position: 'bottomleft',\n        colors: [ '#ff0000', '#28c9ff', '#0000ff', '#ecf386' ],\n        labels: [ 'National Cycle Route', 'Regional Cycle Route', 'Local Cycle Network', 'Cycleway' ]\n    },\n    defaults: {\n        tileLayer: \"http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png\",\n        tileLayerOptions: {\n            attribution: '\u003ca href=\"http://www.opencyclemap.org/\"\u003eOpen Cycle Map\u003c/a\u003e'\n        },\n    }\n}",
	"selectedVisualizationId": "crPBxsBKaeroW6yGq"
},
{
	"_id": "DxX8kK4KRPXjhJ5kJ",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "simpleHTTP",
	"name": "Japan GeoJSON",
	"url": "http://tombatossals.github.io/angular-leaflet-directive/examples/json/JPN.geo.json",
	"poll": {
		"enabled": false,
		"intervalSec": 20
	}
},
{
	"_id": "XtsxDSh3BL8pGvqNQ",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "transformed",
	"name": "Geo JSON",
	"parents": [
		"DxX8kK4KRPXjhJ5kJ"
	],
	"transformFunction": "x =\u003e {\n    return {\n        center: {\n            lat: 38.51,\n            lng: 139,\n            zoom: 4\n        },\n        defaults: {\n            scrollWheelZoom: false\n        },\n        geojson: {\n            data: x,\n            style: {\n                fillColor: \"#ccfa12\",\n                weight: 2,\n                opacity: 1,\n                color: 'white',\n                dashArray: '3',\n                fillOpacity: 0.7\n            }\n        }\n    }\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "gpvzLtxTvTLCxADfR"
},
{
	"_id": "NNQ9r4tYyXLJfWzyK",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "transformed",
	"name": "Bounds",
	"parents": [],
	"transformFunction": "() =\u003e {\n    return {\n        bounds: leafletBoundsHelpers.createBoundsFromArray([\n            [ 51.508742458803326, -0.087890625 ],\n            [ 51.508742458803326, -0.087890625 ]\n        ])\n    };\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "7nptNJ6b9XKgdedYu"
},
{
	"_id": "tEheoTBzYnS3ZBKpQ",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "transformed",
	"name": "Max Bounds",
	"parents": [],
	"transformFunction": "() =\u003e {\n    return {\n        center: {\n            lat: 40.743,\n            lng: -75.176,\n            zoom: 12\n        },\n        maxbounds: leafletBoundsHelpers.createBoundsFromArray([\n            [40.712, -74.227],\n            [40.774, -74.125]\n        ])\n    };\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "oQxMgFJvH68gXJArZ"
},
{
	"_id": "sTfgygBHQn5KnHtv7",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "simpleHTTP",
	"name": "IP Geo",
	"url": "http://freegeoip.net/json/",
	"poll": {
		"enabled": false,
		"intervalSec": 20
	}
},
{
	"_id": "hXmDDYqcTet6XwhKa",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "transformed",
	"name": "IP Geo Location",
	"parents": [
		"sTfgygBHQn5KnHtv7"
	],
	"transformFunction": "x =\u003e {\n    return {\n        center: {\n            lat: x.latitude,\n            lng: x.longitude,\n            zoom: 16\n        },\n        markers: {\n            m1: {\n                lat: x.latitude,\n                lng: x.longitude\n            }\n        }\n    }\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "PZ57T6FWLmkNQ8SYE"
},
{
	"_id": "5oJFX5SxWexTCD9ca",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "raw",
	"name": "Layers",
	"rawData": "{\n    layers: {\n        baselayers: {\n            osm: {\n                name: 'OpenStreetMap',\n                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',\n                type: 'xyz'\n            },\n            Stamen: {\n                name: 'Stamen',\n                type: 'xyz',\n                url: \"http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg\"\n            }\n        }\n    }\n}",
	"selectedVisualizationId": "ecDTkT9PC7rfQoCSY"
},
{
	"_id": "iEahWn8fycZDsGjfZ",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "transformed",
	"name": "Paths",
	"parents": [],
	"transformFunction": "() =\u003e {\n    let europeCapitals = {\n        Madrid: {\n            lat: 40.4,\n            lng: -3.6833333\n        },\n        Rome: {\n            lat: 41.9,\n            lng: 12.4833333\n        },\n        London: {\n            lat: 51.5,\n            lng: -0.116667\n        },\n        Lisbon: {\n            lat: 38.7166667,\n            lng: -9.1333333\n        },\n        Berlin: {\n            lat: 52.5166667,\n            lng: 13.4\n        },\n        Paris: {\n            lat: 48.866667,\n            lng: 2.333333\n        },\n        Brussels: {\n            lat: 50.8333,\n            lng: 4\n        }\n    };\n\n    let pathsDict = {\n        polyline: {\n            type: \"polyline\",\n            latlngs: [ europeCapitals.London, europeCapitals.Madrid, europeCapitals.Rome]\n        },\n        multiPolyline: {\n            type: \"multiPolyline\",\n            latlngs: [\n                [ europeCapitals.London, europeCapitals.Lisbon ],\n                [ europeCapitals.Paris, europeCapitals.Madrid ],\n                [ europeCapitals.Rome, europeCapitals.Berlin ]\n                ]\n        },\n        polygon: {\n            type: \"polygon\",\n            latlngs: [ europeCapitals.London, europeCapitals.Lisbon , europeCapitals.Madrid, europeCapitals.Paris ]\n        },\n        multiPolygon: {\n            type: \"multiPolygon\",\n            latlngs: [\n                [europeCapitals.London, europeCapitals.Lisbon , europeCapitals.Madrid, europeCapitals.Paris ],\n                [ europeCapitals.Berlin, europeCapitals.Rome, europeCapitals.Brussels ]\n            ]\n        },\n        rectangle: {\n            type: \"rectangle\",\n            latlngs: [ europeCapitals.Berlin, europeCapitals.Lisbon ]\n        },\n        circle: {\n            type: \"circle\",\n            radius: 500 * 1000,\n            latlngs: europeCapitals.Brussels\n        },\n        circleMarker: {\n            type: \"circleMarker\",\n            radius: 50,\n            latlngs: europeCapitals.Rome\n        }\n    };\n    \n    return {\n        center: {\n            lat: 51.505,\n            lng: -0.09,\n            zoom: 3            \n        },\n        paths: {\n            multiPolygon: pathsDict.multiPolygon\n        }\n    }\n}",
	"stateParams": {
		"enabled": false,
		"state": "{\n  initialValue: 17\n}"
	},
	"selectedVisualizationId": "4Fy3fG8Xjpa7SGEvD"
},
{
	"_id": "oZF4xTTraiir4avX6",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "ruHbJhctjLhCYZiof",
	"dataSetType": "raw",
	"name": "Tiles",
	"rawData": "{\n    url: \"http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png\",\n    options: {\n        attribution: '\u0026copy; \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eOpenStreetMap\u003c/a\u003e contributors'\n    }\n}",
	"selectedVisualizationId": "fNxikntSNTPpnunKj"
},
{
	"_id": "cpvWhCdrwde89sDRz",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"dataSetType": "websocket",
	"name": "Dynamic Websocket",
	"url": "ws://readnodered.mybluemix.net/ws/simple",
	"bufferSize": 20
},
{
	"_id": "d7kBgpXTTwYLCrXMg",
	"userId": "guest",
	"appId": "jetLpRfQ3BCRGiMxe",
	"dashboardId": "YPHGTDAsaursHHfPQ",
	"dataSetType": "transformed",
	"name": "Stateful Websocket",
	"parents": [
		"cpvWhCdrwde89sDRz"
	],
	"transformFunction": "(x, s) =\u003e {\n    if (s.length === 200) s.splice(0, 1)\n    s.push(x);\n    return s.map((v, i) =\u003e {\n        return {\n            time: i,\n            sin: v\n        }\n    });\n}",
	"stateParams": {
		"enabled": true,
		"state": "[]"
	},
	"selectedVisualizationId": "bEhyQppynjZRGLJxe"
}]

