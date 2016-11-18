import R from 'r-script';
import Pattern from './pattern';
import _ from 'underscore';
import assert from 'assert';
import config from 'config';
import MetricsAPIAdapter from './../metrics-api-adapter';
import RenderAPIAdapter from './../render-api-adapter';
import async from 'async';
import {EpochToDate} from './../utility';
import moment from 'moment';

var interpL = require( 'line-interpolate-points' )
var exec = require('child_process').exec;

let graphiteURL = config.get('graphiteURL');

/** 
 * @class Covariance
 * @brief Given a time-range of data in a metric, find other metrics which are most linearly correlated to the
 * change observed over that period	
 * @extends Pattern
 */
class Covariance extends Pattern {

    /**
     * Rules/patterns given are all treated as 'AND'. That is all rules/patterns
     * must be satisfied in order for error to be 0.
     *
     * @param [
     *          {
     *            target: String,
     *            data: JSON
     *          }
     *        ] metricTarget of values which are to be used for comparison
     *
     */
	constructor(metricTarget) {
        super(Covariance.name)
        assert(metricTarget.length ==1, "There must only be a single metric to initialize the class");
        this.cleanNulls(metricTarget[0].datapoints); //change all null values to 0 for later processing in R

        //set class attributes
        let dataLength = metricTarget[0].datapoints.length;
        this.metricTarget = metricTarget;
        this.startTime = (metricTarget[0].datapoints)[0][1];
        this.endTime = (metricTarget[0].datapoints)[dataLength-1][1];
        this.metricDict = {}; 
        this.errorDict = {};
    }

    /**
     * @see Pattern.getPattern
     */
    getPattern() {
        return this.metricTarget;
    }

    getStartTime() {
        return this.startTime;
    }

    getEndTime() {
        return this.endTime;
    }

    getMetricDict() {
        return this.metricDict;
    }

    /**
     * @see Pattern.error
     *	this curently requires metrics to be the same timeframe and number of points as the metricTarget
     */
    error(metrics) {
        
    	this.cleanNulls(metrics[0].datapoints);
		
		var out = R("r-modules/linear-correlation.R")
    	.data(this.metricTarget[0].datapoints, metrics[0].datapoints)
    	.callSync();

        return out
    }

    covariance(metrics) {

    	this.cleanNulls(metrics[0].datapoints);

    	var out = R("r-modules/linear-covariance.R")
    	.data(this.metricTarget[0].datapoints, metrics[0].datapoints)
    	.callSync();

        return out
    }

    correlation(metrics){
        this.cleanNulls(metrics[0].datapoints);

        metrics[0].datapoints= this.covInterpP(metrics[0].datapoints);

        var out = R("r-modules/linear-correlation.R")
        .data(this.metricTarget[0].datapoints, metrics[0].datapoints)
        .callSync();

        return out
    }

    correlationAsync(metrics) {
        //This will return a negative or positive correlation or 'NA' if one of the metrics is a flat line
    	this.cleanNulls(metrics[0].datapoints);

        metrics[0].datapoints= this.covInterpP(metrics[0].datapoints);

    	R("r-modules/linear-correlation.R")
    	.data(this.metricTarget[0].datapoints, metrics[0].datapoints)
    	.call(function(err, out) {
            if (err){ throw err; } // this is sometimes coming back as a missing library. 
            return out;
            });
    }

/**
*Finds the local minima and maxima for a given timeframe in the metric data.
*/
    findLocalMinMax(metrics, timeframe){
        this.cleanNulls(metrics[0].datapoints);

        R("r-modules/interpolatePOI.R")
        .data(metrics[0].datapoints)
        .call(function(err, out) {
            if (err){ throw err; } // this is sometimes coming back as a missing library. 
            return out;
            });
    }

/**performs a linear correlation with all metrics at the same time period as the original
populates a dictionary metricDict: {"metric name": correlation vaue}
Metrics which returned an error are recorded with their error in ErrorDict. Most of these are for 
'incompatible dimentions'. 
TODO: We can look at interpolating points*/
    correlationAllMetrics(callback1){
        //TODO: move these class initializations to be static objects somewhere for better performance
        var metricAPI = new MetricsAPIAdapter(graphiteURL); 
        var render = new RenderAPIAdapter(graphiteURL);
        var allMetrics = metricAPI.findAll();
        var totalMetrics = allMetrics.length;
        var completedMetrics = 0;

        /*var smallTest = [];
        smallTest.push(allMetrics[0]);
        smallTest.push(allMetrics[1]);
        smallTest.push(allMetrics[2]);
        console.log('number of metrics: ',smallTest.length); */



        var start = moment.unix(this.getStartTime()).utc().format('HH:mm_YYYYMMDD');
        var end = moment.unix(this.getEndTime()).utc().format('HH:mm_YYYYMMDD');
        var self = this;
        async.forEach(Object.keys(allMetrics), function(metricIndex, callback2) {
            let metricName = allMetrics[metricIndex];
            exec(render.renderAsync({
                target: metricName,
                format: 'json',
                from: start,
                until: end,     
            }, function(result, error){

                if(error){
                    console.log(metricName, error);
                }
                else{
                    try {
                        let cor = self.correlation(result);
                        self.metricDict[metricName] = cor;
                        completedMetrics++;
                        console.log("Completed: ",completedMetrics,"/" ,totalMetrics);

                    }catch(e){
                        //console.log(metricName, result.length, e);
                        self.errorDict[metricName] = e;
                    }

                }

            callback2();
            }));
            //console.log(renderRes);
            //let cor = covObj.correlation(renderRes);
            //metricDict[metric] = cor;

        }, function(err) {
                    if(err){
                        throw err;
                    }
                //success case here
                console.log("Dictionary Results: ");
                console.log(self.metricDict);
                callback1(0);
            }
        );
    }
/**check a given metric in a large timeframe and see if it deviates significantly in that timespan
takes a metric and an int multiplier to signify the number of standard deviations from the median a value must
be to be returned. Returns a list of timestamps for the identified data points*/
    metricDeviation(metrics, stDevMulti){

        this.cleanNulls(metrics[0].datapoints);
        
        var out = R("r-modules/deviation.R")
        .data(this.metricTarget[0].datapoints, stDevMulti)
        .callSync();

        return out

    }

    /**changes all the null values to 0. */
    cleanNulls(datapoints) {
    	datapoints = datapoints.map(function(datapoint) {
    		if (!_.isNumber(datapoint[0])) {
    			datapoint[0] = 0;
    		}
    		return 0;
    	});
    }

    /**
    * takes 2 sets of datapoints and equalizes the number of points between them by making the smaller set 
    * the same length of the larger set.
    * @param 2 arrays of 2D datapoints
    * @returns [interpolatedSet1, interpolatedSet2] array containing both arrays of datapoints
    */
    interpolatePoints(set1, set2){

        if (set1.length == 0 || set2.length ==0){
            return null;
        }
        if (set1.length > set2.length){
            set2 = interpL(set2, set1.length);
        }
        if (set1.length < set2.length){
            set1= interpL(set1, set2.length);
        }
        var ret = [];
        ret.push(set1);
        ret.push(set2);
        return ret;
    }

    /**
    *takes a single set of datapoints and makes the number of points equal to the number of points
    *in the set which initialized the covaraince class instantiation. This ensures that when running many comparisons
    *we do not interpolate based on already interpolated data. see correlationAllMetrics() for an example of comparing 
    *many metrics
    */
    covInterpP(datapoints){
        var set1 = this.metricTarget[0].datapoints;
        var set2 = datapoints

        if (set1.length == 0 || set2.length ==0){
            //throw "Can only compare metrics with data in time range";
            return 1;
        }
            set2 = interpL(set2, set1.length);


        return set2;
    }


    /**
     * @returns {{pattern: Object, _type: String }} Serialized covarianceSet pattern.
    */
    serialize() {
        // We don't want to modify this.pattern thus deep Copy it first.
        let clonedPattern = utility.deepCopy(this.getPattern());

        // Class can't be serialized.
        clonedPattern.forEach(pattern => {
            pattern.metricTarget = serializeMETRICTARGET(pattern.metricTarget)
        });

        let serializedPattern = {
            pattern: clonedPattern,
            _type: this._type
        };
        return serializedPattern;
    }

    /**
     * @see Pattern.deserialize
     * @static
     * @param {Object} serializedPattern A serialized covarianceSet pattern.
     * @returns {Covariance} covariance instance.
     */
    static deserialize(serializedPattern) {
        serializedPattern.pattern.forEach(pattern => {
            pattern.metricTarget = deserializeMETRICTARGET(pattern.metricTarget);
        });

        return new Covariance(serializedPattern.pattern);
    }



}

export {Covariance};
