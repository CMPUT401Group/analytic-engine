// example.js
import R from 'r-script';
import {Covariance} from './patterns';
import RenderAPIAdapter from './render-api-adapter';
import config from 'config';    
var interpL = require( 'line-interpolate-points' );
let graphiteURL = config.get('graphiteURL');
/**
 * @param {[{target:string, datapoints:[]}]}
 */
var metric1 = [
            {
                target: 'dummy.metric.1',
                datapoints: [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]]
            }
        ];
/**
 * @param {[{target:string, datapoints:[]}]}
 */
var metric2 = [                  
			{
                target: 'dummy.metric.2',
                datapoints: [[14, 6], [11, 7], [18, 8], [10, 9], [23,10]]
            }
        ];


/**
 * @description passes data from java script to R readable format
 */
// sync
//var out = R("r-modules/deviation.R")
 //   .data(metric1[0].datapoints,1)
 //   .callSync();

//var out = interpL(metric1[0].datapoints,10);
var render = new RenderAPIAdapter(graphiteURL);
var renderRes = render.render({
            target: 'IN.stb-sim.dean.RequestTiming.count',
            format: 'json',
            from: '17:00_20160921',
            until: '18:00_20160921',
        }); 
let cov = new Covariance(renderRes);

function done(){
    //do nothing becase we're printing the dictionary elsewhere.
}

cov.correlationAllMetrics( ()=> done() );// takes forever (>30 min)
//console.log(out);
