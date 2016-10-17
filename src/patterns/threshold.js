import Enum from 'es6-enum';
import _ from 'underscore';
import assert from 'assert';

import Pattern from './pattern';
import utility from '../utility';

const THRESHOLDRULE = Enum('LESSTHAN', 'LESSTHANEQUAL', 'EQUAL', 'GREATERTHANEQUAL', 'GREATERTHAN');

/**
 * Converts given THRESHOLDRULE to string so we can serialize it in db.
 * @param {THRESHOLDRULE} thresholdRule A THRESHOLDRULE enum
 * @returns {String} Serializable string version of the given thresholdRule.
 * @exception Given an invalid thresholdRule
 */
function serializeTHRESHOLDRULE(thresholdRule) {
    switch (thresholdRule) {
        case THRESHOLDRULE.LESSTHAN:
            return 'LESSTHAN';
        case THRESHOLDRULE.LESSTHANEQUAL:
            return 'LESSTHANEQUAL';
        case THRESHOLDRULE.EQUAL:
            return 'EQUAL';
        case THRESHOLDRULE.GREATERTHANEQUAL:
            return 'GREATERTHANEQUAL';
        case THRESHOLDRULE.GREATERTHAN:
            return 'GREATERTHAN';
        default:
            throw new Error(`Given threshold rule is invalid.`);
    }
}

/**
 * Converts back a string (probably stored from db) to its corresponding THRESHOLDRULE.
 * @param serializedThresholdRule Serialized THRESHOLDRULE enum string.
 * @returns {THRESHOLDRULE} The THRESHOLDRULE enum of the string.
 * @throws exception if given string does not correspond to a THRESHOLDRULE enum.
 */
function deserializeTHRESHOLDRULE(serializedThresholdRule) {
    switch (serializedThresholdRule) {
        case 'LESSTHAN':
            return THRESHOLDRULE.LESSTHAN;
        case 'LESSTHANEQUAL':
            return THRESHOLDRULE.LESSTHANEQUAL;
        case 'EQUAL':
            return THRESHOLDRULE.EQUAL;
        case 'GREATERTHANEQUAL':
            return THRESHOLDRULE.GREATERTHANEQUAL;
        case 'GREATERTHAN':
            return THRESHOLDRULE.GREATERTHAN;
        default:
            throw new Error(`Given threshold rule string: ${serializedThresholdRule} is invalid.`);
    }
}

const thresholdRulesDocTemplate = "{" +
    "  target: String," +
    "  thresholdRule: THRESHOLDRULE" +
    "  value: Number" +
    "}";

/**
 * @class Threshold
 * @brief A simple pattern that if a specified subset of metrics matched a threshold, the pattern is matched.
 * @extends Pattern
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
        super(Threshold.name);

        assert(_.isArray(thresholdRules), `${Threshold.name} constructor should be given Array of \n  ${thresholdRulesDocTemplate}`);
        assert(thresholdRules.length > 0, `${Threshold.name} constructor should be given a non empty Array of \n  ${thresholdRulesDocTemplate}`);

        // validate each rule.
        for (let thresholdRule of thresholdRules) {
            assert(_.isObject(thresholdRule), `${Threshold.name} constructor: One of the threshold rule is not \n ${thresholdRulesDocTemplate}`);
            assert(thresholdRule.target, `${Threshold.name} constructor: One of the {threshold rule}.target is not a string.`);
            assert(
                thresholdRule.thresholdRule == THRESHOLDRULE.LESSTHAN ||
                thresholdRule.thresholdRule == THRESHOLDRULE.LESSTHANEQUAL ||
                thresholdRule.thresholdRule == THRESHOLDRULE.EQUAL ||
                thresholdRule.thresholdRule == THRESHOLDRULE.GREATERTHANEQUAL ||
                thresholdRule.thresholdRule == THRESHOLDRULE.GREATERTHAN, `${Threshold.thresholdRule} constructor: One of the {threshold rule}.thresholdRule is not an instance of THRESHOLDRULE.`);
            assert(_.isNumber(thresholdRule.value), `${Threshold.thresholdRule} constructor: One of the {threshold rule}.value is not a javascript Number.`);
        }

        this.thresholdRules = thresholdRules;
    }

    /**
     * @see Pattern.getPattern
     */
    getPattern() {
        return this.thresholdRules;
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

    /**
     * @returns {{pattern: Object, _type: String }} Serialized Threshold pattern.
     */
    serialize() {
        // We don't want to modify this.pattern thus deep Copy it first.
        let clonedPattern = utility.deepCopy(this.getPattern());

        // Class can't be serialized.
        clonedPattern.forEach(pattern => {
            pattern.thresholdRule = serializeTHRESHOLDRULE(pattern.thresholdRule)
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
     * @param {Object} serializedPattern A serialized Threshold pattern.
     * @returns {Threshold} Threshold instance.
     */
    static deserialize(serializedPattern) {
        // Convert serialized THRESHOLDRULES to THRESHOLDRULES.
        serializedPattern.pattern.forEach(pattern => {
            pattern.thresholdRule = deserializeTHRESHOLDRULE(pattern.thresholdRule);
        });

        return new Threshold(serializedPattern.pattern);
    }
}

export {THRESHOLDRULE, Threshold};