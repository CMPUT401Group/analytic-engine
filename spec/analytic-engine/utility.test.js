import utility from '../../src/utility';

describe("AnalyticEngine - Utility", function() {
    it("objToURLParam - convert js obj to url parameters.", function() {
        let obj = {
            param1: 'wtf',
            param2: 'holyfu*asd'
        };
        let expectedURLParam = 'param1=wtf&param2=holyfu*asd';
        expect(utility.objToURLParam(obj)).toBe(expectedURLParam);
    });
});