import utility from '../../src/utility';
import {EpochToDate} from '../../src/utility';

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
        let expected_APIFormat = '23:00:00_20151231'
        expect(EpochToDate(UNIXTimestamp)).toBe(expected_APIFormat)

    });
});