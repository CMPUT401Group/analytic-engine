import utility from '../../src/utility';
import {Normalize} from '../../src/utility';

/**
 * @description Test suite for utility.js:
 * Utilizing jasmine as our Javascript testing framework
 * {@tutorial https://jasmine.github.io/2.5/introduction}
 * @deprecated EpochToDate current functionality, replaced with
 * moment JS_lib;
 * @see http://momentjs.com/docs/
 */
var default_metric = [
    {
        target: 'dummy.metric.1',
        datapoints: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] //straight line
    }
];

var metric_expected = [
    {
        target: 'dummy.metric.2',
        datapoints: [[0, 1], [0.25, 2], [0.5, 3], [0.75, 4], [1, 5]]//moved +1 in the x axis from metric1
    }
];
describe("AnalyticEngine - Utility", function() {
    it("objToURLParam - convert js obj to url parameters.", function() {
        let obj = {
            param1: 'wtf',
            param2: 'holyfu*asd'
        };
        let expectedURLParam = 'param1=wtf&param2=holyfu*asd';
        expect(utility.objToURLParam(obj)).toBe(expectedURLParam);
    });

    it("Normalize the data set so that it is in a range of 0-1", function () {

        expect(Normalize(default_metric, 1)).toBe(metric_expected[0].datapoints)

    });
});