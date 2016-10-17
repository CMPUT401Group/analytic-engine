import Enum from 'es6-enum';
import _ from 'underscore';

import Pattern from './pattern';

let THRESHOLDRULE = Enum('LESSTHAN', 'LESSTHANEQUAL', 'EQUAL', 'GREATERTHANEQUAL', 'GREATERTHAN');

/**
 * @class Threshold
 * @brief
 */
class Threshold extends Pattern {
    /**
     * Rules/patterns given are all treated as 'AND'. That is all rules/patterns
     * must be satisfied in order for error to be 0.
     *
     * @param [
     *          {
     *            target: String,
     *            thresholdRule: THRESHOLDRULE
     *            value: Number
     *          },
     *          ...
     *        ] thresholdRules Array of threshold rules.
     */
    constructor(thresholdRules) {
        super();
        this.thresholdRules = thresholdRules;
    }

    /**
     * @see Pattern.error
     */
    error(metrics) {
        let thresholdSatisfied = true;

        // Get rid of data/metric without rules. We don't care about them.
        metrics = metrics.filter(metric => {
            let datumThresholdRule = this._getTargetThresholdRule(metric.target);
            return _.isObject(datumThresholdRule);
        });

        // Since we treat all rules as AND, the given data is said to deviate if
        // not all of them is present.
        let dataCardinalityMismatch = metrics.length !== this.thresholdRules.length;
        if (dataCardinalityMismatch) {
            console.log('Threshold.error - Data Cardinality Mismatch.');
            thresholdSatisfied = false;
        }

        // TODO: This is not optimized at all. We called this._getTargetThresholdRule
        //       twice in this method for each datum.target. Implement a has to constructor
        //       speed up retrieval.
        for (let metric of metrics) {
            thresholdSatisfied &= this._doesMetricSatisfyThresholdRule(metric);
        }

        return thresholdSatisfied ? 0 : Number.POSITIVE_INFINITY;
    }

    _doesMetricSatisfyThresholdRule(metric) {
        let datumThresholdRule = this._getTargetThresholdRule(metric.target);
        let yDataPoints = metric.datapoints.map(dataPoint => dataPoint[0]);

        switch(datumThresholdRule.thresholdRule) {
            case THRESHOLDRULE.LESSTHAN:
                return yDataPoints.reduce((prevVal, yDataPoint) => {
                    return prevVal || yDataPoint < datumThresholdRule.value
                }, false);
            case THRESHOLDRULE.LESSTHANEQUAL:
                return yDataPoints.reduce((prevVal, yDataPoint) => {
                    return prevVal || yDataPoint <= datumThresholdRule.value
                }, false);
            case THRESHOLDRULE.EQUAL:
                return yDataPoints.reduce((prevVal, yDataPoint) => {
                    return prevVal || yDataPoint == datumThresholdRule.value
                }, false);
            case THRESHOLDRULE.GREATERTHANEQUAL:
                return yDataPoints.reduce((prevVal, yDataPoint) => {
                    return prevVal || yDataPoint >= datumThresholdRule.value
                }, false);
            case THRESHOLDRULE.GREATERTHAN:
                return yDataPoints.reduce((prevVal, yDataPoint) => {
                    return prevVal || yDataPoint > datumThresholdRule.value
                }, false);
            default:
                throw new Error('Unexpected THRESHOLDRULE given.');
        }
    }

    /**
     * @param {String} target The metric name to get a rule for
     * @return {{target String, thresholdRule: THRESHOLDRULE, value: Number } | null}
     * @private
     */
    _getTargetThresholdRule(target) {
        for (let thresholdRule of this.thresholdRules) {
            // todo: decide what data to feed in Pattern.error
            if (thresholdRule.target == target ||
                target.indexOf(thresholdRule.target) >= 0) {
                return thresholdRule;
            }
        }

        return null;
    }
}

export {THRESHOLDRULE, Threshold};