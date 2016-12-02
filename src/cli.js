import config from 'config';
import RenderAPIAdapter from './render-api-adapter';
import {Covariance} from './patterns';
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
  { name: 'help', alias: 'h', type: Boolean }
]

const options = commandLineArgs(optionDefinitions)

console.log(options);

function helpMsg(){
	console.log("this is the help message");
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
	        //do something
	        break;

	    case 'entailment_search':
	        //do something
	        break;

	    default:
	        helpMsg();
	} 
}

/* node dist/cli.js correlation --metric1 IN.stb-sim.dean.RequestTiming.count --metric2 "IN.stb-sim.dean.RequestTiming.count" \
--m1_start 17:00_20160921 --m1_end 18:00_20160921 



*/