//import Validate from 'validate-arguments';
import NonLinearPatternMatching from '../../src/non-linear-pattern-matching';

/**
 * @description Test suite for non-linear-pattern-matching.js:
 * Utilizing jasmine as our Javascript testing framework
 * {@tutorial https://jasmine.github.io/2.5/introduction}
 */


describe("AnalyticEngine - NonLinearPatternMatching", function() {
    beforeEach(function() {

    });

    it("error - no data sets throws exception.", function() {
        expect((new NonLinearPatternMatching).error.bind([], [])).toThrow();
    });

    it("error - perfect simple 2 data sets have '0' error.", function() {
        let realDataSets = [
            [0.1, 0.2, 0.3, 0.4, 0.5],
            [0.3, 0.4, 0.5, 0.6, 0.7]
        ];
        let patternDataSets = realDataSets;

        let error = (new NonLinearPatternMatching).error(realDataSets, patternDataSets);

        expect(error).toEqual(0);
    });

    it("error - imperfect simple 2 data sets have some error.", function() {
        let realDataSets = [
            [0.1, 0.2, 0.3, 0.4, 0.5],
            [0.3, 0.4, 0.5, 0.6, 0.7]
        ];
        let patternDataSets = [
            [0.3, 0.2, 0.3, 0.4, 0.5],
            [0.3, 0.4, 0.5, 0.6, 0.7]
        ];

        let error = (new NonLinearPatternMatching).error(realDataSets, patternDataSets);

        // Should be equal to 0.02 if error is rounded to the nearest 2 decimal digit.
        expect(error).toBeCloseTo(0.02, 2);
    });
});
