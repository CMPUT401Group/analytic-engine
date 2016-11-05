import utility from '../../src/utility';
import {EpochToDate} from '../../src/utility';

/**
 * @description Test suite for utility.js:
 * Utilizing jasmine as our Javascript testing framework
 * {@tutorial https://jasmine.github.io/2.5/introduction}
 * @deprecated EpochToDate current functionality, replaced with
 * moment JS_lib;
 * @see http://momentjs.com/docs/
 */

describe("AnalyticEngine - Utility", function() {
    it("objToURLParam - convert js obj to url parameters.", function() {
        let obj = {
            param1: 'wtf',
            param2: 'holyfu*asd'
        };
        let expectedURLParam = 'param1=wtf&param2=holyfu*asd';
        expect(utility.objToURLParam(obj)).toBe(expectedURLParam);
    });

    it("Epoch to UTC date format for render api adapter - Convert UNIX time to UTC.", function () {
        let UNIXTimestamp = 1451602800
        let expected_APIFormat = '23:00_20151231'
        expect(EpochToDate(UNIXTimestamp)).toBe(expected_APIFormat)

    });
});