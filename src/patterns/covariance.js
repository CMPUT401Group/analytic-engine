import R from 'r-script';
import Pattern from './pattern';
import _ from 'underscore';

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
     */
	constructor(metricTarget) {
        super(Covariance.name);
        this.metricTarget = metricTarget;
    }

    /**
     * @see Pattern.getPattern
     */
    getPattern() {
        return this.metricTarget;
    }

    /**
     * @see Pattern.error
     *	this curently requires metrics to be the same timeframe and number of points as the metricTarget
     */
    error(metrics) {
        


		// sync
		var out = R("r-modules/linear-correlation.R")
    	.data(this.metricTarget[0].datapoints, metrics[0].datapoints)
    	.callSync();

        return out
    }

    covariance(metircs) {
    			var out = R("r-modules/linear-covariance.R")
    	.data(this.metricTarget[0].datapoints, metrics[0].datapoints)
    	.callSync();

        return out
    }

    correlation(metircs) {
    			var out = R("r-modules/linear-correlation.R")
    	.data(this.metricTarget[0].datapoints, metrics[0].datapoints)
    	.callSync();

        return out
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
