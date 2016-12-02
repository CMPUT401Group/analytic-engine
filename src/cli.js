import config from 'config';
import RenderAPIAdapter from './render-api-adapter';
import {Covariance} from './patterns';
import RLAdapter from './rl-adapater';
import {generateDashboard} from './utility';
import fs from 'fs';
import 'moment';
import moment from 'moment-timezone';
import getUsage from 'command-line-usage';

moment.tz.setDefault("utc");

const commandLineArgs = require('command-line-args')

let graphiteURL = config.get('graphiteURL');
 
const optionDefinitions = [
  { name: 'function', type: String, multiple: false, defaultOption: true }, // this is the type of analysis
  { name: 'metric1',  type: String },
  { name: 'metric2', type: String },
  { name: 'm1_start',  type: String },
  { name: 'm1_end',  type: String },
  { name: 'm2_start',  type: String },
  { name: 'm2_end', type: String },
  { name: 'std_dev', alias: 'd', type: Number },
  { name: 'help', alias: 'h', type: Boolean },

  // RL args.
  { name: 'goal-metric', type: String },
  { name: 'goal-metric-time-begin', type: String },
  { name: 'goal-metric-time-end', type: String },
  { name: 'time-begin', type: String },
  { name: 'time-end', type: String },
  { name: 'iteration-count', type: Number },
  { name: 'out', type: String },
  { name: 'dashboard-out', type: String }
];

const options = commandLineArgs(optionDefinitions);

const cliTimeArgsFormat = 'hh:mm_YYYYMMDD';

function helpMsg(){
	let cliExecutable = 'node ./dist/cli.js';
	const sections = [
		{
			header: 'Analytic Engine',
			content: 'Understanding the world with our analysis.'
		},
		{
			header: 'Synopsis',
			content: `$ ${cliExecutable} <command> <option>`
		},
		{
			header: 'Command',
			content: [
				{ name: 'entailment_search', summary: 'Given a goal-metric in some time frame searches a list of entailing metrics.' }
			]
		},
		{
			header: 'entailment_search',
			optionList: [
				{
					name: 'time-begin',
					description: 'The begin time of the search space in ${cliTimeArgsFormat}'
				},
				{
					name: 'time-end',
					description: `The begin time of the search space in ${cliTimeArgsFormat}`
				},
				{
					name: 'goal-metric',
					description: 'The name of the metric to search entailments for.'
				},
				{
					name: 'goal-metric-time-begin',
					description: `The begin time of the goal metric in ${cliTimeArgsFormat}. Must be greater than or equal {time-begin}.`
				},
				{
					name: 'goal-metric-time-end',
					description: `The end time of the goal metric in ${cliTimeArgsFormat}. Must be less than or equal {time-begin}.`
				},
				{
					name: 'iteration-count',
					description: `The higher, the more accurate is the result.`
				},
				{
					name: 'out',
					description: 'Output file of the reinforcement learning data.'
				},
				{
					name: 'dashboard-out',
					description: 'Output file of the grafana dashboard.'
				}
			]
		},
		{
			header: 'Sample: entailment_search',
			content: [
				`${cliExecutable} entailment_search \
--goal-metric invidi.webapp.localhost_localdomain.request.total_response_time.mean \
--time-begin 00:00_20160917 --time-end 23:00_20160917 \
--goal-metric-time-begin 05:00_20160917 --goal-metric-time-end 12:00_20160917 \
--iteration-count 10000 \
--out /tmp/temp-result.json --dashboard-out /tmp/dashboard.json`
			]
		}
	];
	const usage = getUsage(sections);
	console.log(usage);
}

if (options.help == true){
	//output the help message
	helpMsg();
}
if (!options.hasOwnProperty("m2_start")){
	options.m2_start = options.m1_start //reuse the first date
}
if (!options.hasOwnProperty("m2_end")){
	options.m2_end = options.m1_end 
}


if (options.hasOwnProperty("function")){
	switch(options.function.toLowerCase()) {
	    case 'correlation':

	      //resolve the metrics into their respective datapoints
	      var render = new RenderAPIAdapter(graphiteURL);
	      var renderRes1 = render.render({
	        target: options.metric1,
	        format: 'json',
	        from: options.m1_start,
	        until: options.m1_end,
	      });
	      var renderRes2 = render.render({
	        target: options.metric2,
	        format: 'json',
	        from: options.m2_start,
	        until: options.m2_end,
	      });

	      //apply the requested function and return the result
	      var cov = new Covariance(renderRes1);
	      var result = cov.correlation(renderRes2);
	      console.log('Linear Correlation: ', result);

	        break;
	    case 'covariance':
	      //resolve the metrics into their respective datapoints
	      var render = new RenderAPIAdapter(graphiteURL);
	      var renderRes1 = render.render({
	        target: options.metric1,
	        format: 'json',
	        from: options.m1_start,
	        until: options.m1_end,
	      });
	      var renderRes2 = render.render({
	        target: options.metric2,
	        format: 'json',
	        from: options.m2_start,
	        until: options.m2_end,
	      });

	      //apply the requested function and return the result
	      var cov = new Covariance(renderRes1);
	      var result = cov.covariance(renderRes2);
	      console.log('Covariance: ', result);

	        break;

	    
	    case 'deviation':
	      //resolve the metrics into their respective datapoints
	      var render = new RenderAPIAdapter(graphiteURL);
	      var renderRes1 = render.render({
	        target: options.metric1,
	        format: 'json',
	        from: options.m1_start,
	        until: options.m1_end,
	      });

	      //apply the requested function and return the result
	      var cov = new Covariance(renderRes1);

	      var result
	      if (!options.hasOwnProperty("std_dev")){
	      	result = cov.metricDeviation(renderRes1);
	      }
	      else {
	      	result = cov.metricDeviation(renderRes1, options.std_dev);
	      }
	      console.log('Number of deviant points: ', result.length);

	        break;

	    case 'search':
	      //resolve the metrics into their respective datapoints
	      var render = new RenderAPIAdapter(graphiteURL);
	      var renderRes1 = render.render({
	        target: options.metric1,
	        format: 'json',
	        from: options.m1_start,
	        until: options.m1_end,
	      });

	      //apply the requested function and return the result
	      var cov = new Covariance(renderRes1);


	      	function done(){
	    		var dict = cov.getMetricDict();

				//I am changing the dictionary to an array. I had originally used a javascript object (dictionary)
				//because I wanted multiple threads to share it. In retrospect, JS is not designed for that task
				var top30 = Object.keys(dict).map(function(key) {
	    			return [key, dict[key]];
				});


				//the strucure is [["metricname",[1,2]],...] first element is correlation, second covariance
				top30.sort(function(first, second) {
	    			return second[1][0] - first[1][0];
				});

				console.log(top30.slice(0, 30));

				//write a dashboard to dashboard.json in the current directory
				//TODO: make the argument for outputting this to a set file
				let timeBeginUTC = moment(options.m1_start, 'hh:mm_YYYYMMDD').format('YYYY-MM-DD HH:mm:ss');
				let timeEndUTC = moment(options.m1_end, 'hh:mm_YYYYMMDD').format('YYYY-MM-DD HH:mm:ss');

				let dashboardOptions = {
					title: 'Statistical correlation',
					from: timeBeginUTC,
					to: timeEndUTC,
					rows: []
				};
				dashboardOptions.rows = top30.map(r => {
					return {
						title: `Correlation: ${r[1][0]} - Covariance: ${r[1][1]}`,
						targetName: r[0]
					};
				});
				fs.writeFileSync(
					options["dashboard-out"],
					JSON.stringify(generateDashboard(dashboardOptions))
				);

			}

			cov.correlationAllMetrics( ()=> done() );// takes forever (>30 min)


	        break;

	    case 'entailment_search':
				let timeBegin = + moment(options["time-begin"], 'hh:mm_YYYYMMDD').toDate();
				let timeEnd = + moment(options["time-end"], 'hh:mm_YYYYMMDD').toDate();
				let goalMetricTimeBegin = (+ moment(options["goal-metric-time-begin"], 'hh:mm_YYYYMMDD').toDate())/1000;
				let goalMetricTimeEnd = (+ moment(options["goal-metric-time-end"], 'hh:mm_YYYYMMDD').toDate())/1000;
				let timeBeginUTC = moment(options["time-begin"], 'hh:mm_YYYYMMDD').format('YYYY-MM-DD HH:mm:ss');
				let timeEndUTC = moment(options["time-end"], 'hh:mm_YYYYMMDD').format('YYYY-MM-DD HH:mm:ss');

	    	let config = {
					"timeBegin": timeBegin,
					"timeEnd": timeEnd,
					"goalPattern": {
						"metric": options["goal-metric"],
						"timeBegin": goalMetricTimeBegin,
						"timeEnd": goalMetricTimeEnd
					},
					"iterationCount": options["iteration-count"],
					"initialReward": -1000.0,
					"reinforcementLearning": {
						"stepSize": 0.1,
						"discountRate": 0.9
					},
					"resultFile": options["out"],
				};
				let result = (new RLAdapter).train(config);
				result = result.filter(r => r.reward != null);
				result = result.sort((a, b) => {
					return b.reward - a.reward;
				});

				result = result.slice(0, 40);

				let dashboardOptions = {
					title: 'Reinforcement Learning Model for response time',
					from: timeBeginUTC,
					to: timeEndUTC,
					rows: []
				};
				dashboardOptions.rows = result.map(r => {
					return {
						title: `${r.sourcePattern.metric} - ${r.reward}`,
						targetName: r.sourcePattern.metric
					};
				});
				fs.writeFileSync(
					options["dashboard-out"],
					JSON.stringify(generateDashboard(dashboardOptions))
				);
				break;

	    default:
	        helpMsg();
	} 
}

/* node dist/cli.js correlation --metric1 IN.stb-sim.dean.RequestTiming.count --metric2 "IN.stb-sim.dean.RequestTiming.count" \
--m1_start 17:00_20160921 --m1_end 18:00_20160921

node dist/cli.js deviation --metric1 IN.stb-sim.dean.RequestTiming.count --m1_start 17:00_20160921 --m1_end 18:00_20160921 -d 3


*/