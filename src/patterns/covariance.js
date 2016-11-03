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
        /* TODO: consider adding a list of errors from anaysis as another class attribute
        the metric dict might contain an object with a number of attributes corresponding to different types
        of correlation */
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

    correlation(metrics) {
        //This will return a negative or positive correlation or 'NA' if one of the metrics is a flat line
    	this.cleanNulls(metrics[0].datapoints);

    	var out = R("r-modules/linear-correlation.R")
    	.data(this.metricTarget[0].datapoints, metrics[0].datapoints)
    	.callSync();

        return out
    }

/*performs a linear correlation with all metrics at the same time period as the original
populates a dictionary: {"metric name": correlation vaue} */
    correlationAllMetrics(callback){
        //TODO: move these class initializations to be static objects somewhere for better performance
        var metricAPI = new MetricsAPIAdapter(graphiteURL); 
        var render = new RenderAPIAdapter(graphiteURL);
        var allMetrics = metricAPI.findAll();

        var start = moment.unix(this.getStartTime()).utc().format('HH:mm_YYYYMMDD');
        var end = moment.unix(this.getEndTime()).utc().format('HH:mm_YYYYMMDD');
        var self = this;
        console.log(start);
        async.forEach(Object.keys(allMetrics), function(metricIndex, callback) {
            let metricName = allMetrics[metricIndex];
            render.renderAsync({
                target: metricName,
                format: 'json',
                from: start, //TODO: use start variable after it gets processed into correct format.
                until: end, //TODO: use end variable
            }, function(result, error){

                if(error){
                    console.log(metricName, error); //TODO: do something besides print these errors
                }
                else{
                    try {
                        let cor = self.correlation(result);
                        self.metricDict[metricName] = cor;
                    }catch(e){
                        console.log(metricName, result.length, e);
                }
            }
            });
            //console.log(renderRes);
            //let cor = covObj.correlation(renderRes);
            //metricDict[metric] = cor;

            }, function(err) {
                    if(err){
                        throw err;
                    }
                //success case here
                callback(0);
                console.log(self.metricDict);
                }
        );
    }

    //changes all the null values to 0.
    cleanNulls(datapoints) {
    	datapoints = datapoints.map(function(datapoint) {
    		if (!_.isNumber(datapoint[0])) {
    			datapoint[0] = 0;
    		}
    		return 0;
    	});
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
