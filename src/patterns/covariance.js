import R from 'r-script';
import Pattern from './pattern';
import _ from 'underscore';
import assert from 'assert';
import config from 'config';
import MetricsAPIAdapter from './../metrics-api-adapter';
import RenderAPIAdapter from './../render-api-adapter';

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
Returns a dictionary {"key":value} : {"metric name": correlation vaue} */
    correlationAllMetrics(){
        var metricDict = {};
        //TODO: move these class initializations to be static objects somewhere for better performance
        var metricAPI = new MetricsAPIAdapter(graphiteURL); 
        var render = new RenderAPIAdapter(graphiteURL);
        var allMetrics = metricAPI.findAll();
/*TODO: either get the timeframe from graphana and save the attributes then, or grab them from the metric 
and convert the seconds since Jan 1, 1970 format to the render api format*/
        var start = this.getStartTime();
        var end = this.getEndTime();
        var covObj = this;

        metricDict = allMetrics.map(function(metric){
            let renderRes = render.render({
                target: metric,
                format: 'json',
                from: '17:00_20160919', //TODO: use start variable after it gets processed into correct format.
                until: '18:00_20160919', //TODO: use end variable
            });
            //console.log(renderRes);
            let cor = covObj.correlation(renderRes);
            metricDict[metric] = cor;
            return 0
        });
        return metricDict;
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
