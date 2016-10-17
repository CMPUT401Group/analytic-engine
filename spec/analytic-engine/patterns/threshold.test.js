import {Threshold, THRESHOLDRULE} from '../../../src/patterns';

// Note: Many things in that module are not tested directly, but tested through transitivity :).

describe("AnalyticEngine - Patterns - Threshold", function() {
    it ('constructor setups the Pattern._type', function() {
        let threshold = new Threshold([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.GREATERTHANEQUAL,
                value: 5
            }
        ]);

        expect(threshold._type).toEqual('Threshold');
    });

    it ('getPattern() returns the threshold patterns/rules.', function() {
        let threshold = new Threshold([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.GREATERTHANEQUAL,
                value: 5
            }
        ]);

        expect(threshold.getPattern()).toEqual([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.GREATERTHANEQUAL,
                value: 5
            }
        ]);
    });

    it ('error() returns 0 if metrics is matched', function() {
        let threshold = new Threshold([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.GREATERTHANEQUAL,
                value: 5
            }
        ]);

        let dummyMetrics = [
            // At least one metric is matched.
            {
                target: 'dummy.metric.1',  // Note how this matched one (and our only) of the threshold rule above.
                datapoints: [[0, 1], [1, 2], [2, 3], [3, 4], [6, 5]]  // At least one of the y data points >= 5.
            },
            // Some other irrelevant metrics.
            {
                target: 'dummy.irrelevant.metric.1',
                datapoints: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]  // Note that non of the y data points >= 5.
            }
        ];

        expect(threshold.error(dummyMetrics)).toBe(0);
    });

    it ('error() returns Number.POSITIVE_INFINITY if no match', function() {
        let threshold = new Threshold([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.GREATERTHANEQUAL,
                value: 5
            }
        ]);

        let dummyMetrics = [
            // Some irrelevant metric.
            {
                target: 'dummy.irrelevant.metric.1',
                datapoints: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]  // Note that non of the y data points >= 5.
            }
        ];

        expect(threshold.error(dummyMetrics)).not.toBe(0);
    });

    it ('serialize - proper serialization', function() {
        let threshold = new Threshold([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.GREATERTHANEQUAL,
                value: 5
            }
        ]);

        let expectedSerializedObject = {  // An object so we can save it in mongodb as a single object.
            pattern: [  // An array since for each threshold rule, we serialize them.
                    {
                        target: 'dummy.metric.1',
                        thresholdRule: 'GREATERTHANEQUAL',  // Note this object is converted to string.
                        value: 5
                    }
            ],
            _type: 'Threshold'
        };

        expect(threshold.serialize()).toEqual(expectedSerializedObject);
    });

    it ('deserialize - proper deserializtion', function() {
        let serializedObject = {  // An object so we can save it in mongodb as a single object.
            pattern: [  // An array since for each threshold rule, we serialize them.
                {
                    target: 'dummy.metric.1',
                    thresholdRule: 'GREATERTHANEQUAL',  // Note this object is converted to string.
                    value: 5
                }
            ],
            _type: 'Threshold'
        };

        let expectedThreshold = new Threshold([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.GREATERTHANEQUAL,
                value: 5
            }
        ]);

        expect(Threshold.deserialize(serializedObject)).toEqual(expectedThreshold);
    });
});