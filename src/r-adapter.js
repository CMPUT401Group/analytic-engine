// example.js
import R from 'r-script';
import {Covariance} from './patterns';
import RenderAPIAdapter from './render-api-adapter';
import config from 'config';    
var interpL = require( 'line-interpolate-points' );
let graphiteURL = config.get('graphiteURL');
/**
 * @param {Array.<{target:string, datapoints:Array<{int, int}>}>}
 */
var metric1 = [
            {
                target: 'dummy.metric.1',
                datapoints: [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]]
            }
        ];
/**
 * @param {Array.<{target:string, datapoints:Array<{int, int}>}>}
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

var p1 = new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {
            // This is only an example to create asynchronism
                
                    R("r-modules/linear-correlation.R")
                    .data(this.metricTarget[0].datapoints, metrics[0].datapoints)
                    .call(function(err, out) {
                    if (err){ throw err; } // this is sometimes coming back as a missing library. 
                    resolve(out);
                    });  
        });


p1.then(function(result){
            console.log(result);
            
        }, function(err){
            throw err;
            });
