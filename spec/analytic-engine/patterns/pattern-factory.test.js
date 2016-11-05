import {Threshold, THRESHOLDRULE, PatternFactory} from '../../../src/patterns';

/**
 * @description Test suite for pattern-factory.js:
 * Utilizing jasmine as our Javascript testing framework
 * {@tutorial https://jasmine.github.io/2.5/introduction}
 */


/**
 * @description Testing implements and uses the serialization and
 * deserialization of the pattern classes inheriting from patterns.js.
 * Tests whether data is being properly read and stored back to its
 * expected serialized and deserialized state.
 * Currently implements only threshold pattern
 */
describe("AnalyticEngine - Patterns - PatternFactory", function() {
    it ('Given a serialized Threshold, spits out a Threshold instance', function() {
        let serializedThreshold = {  // An object so we can save it in mongodb as a single object.
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

        expect(PatternFactory.deserialize(serializedThreshold)).toEqual(expectedThreshold);
    });
});