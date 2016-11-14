// example.js
import R from 'r-script';
var interpL = require( 'line-interpolate-points' );
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

var out = interpL(metric1[0].datapoints,10);
console.log(out);
