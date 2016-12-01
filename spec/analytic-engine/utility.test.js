import utility from '../../src/utility';
import {Normalize, FindLocalMaxandMin, generateDashboard, MetricSmoothing, indexFromTimeAfter, indexFromTimeBefore} from '../../src/utility';

/**
 * @description Test suite for utility.js:
 * Utilizing jasmine as our Javascript testing framework
 * {@tutorial https://jasmine.github.io/2.5/introduction}
 * @deprecated EpochToDate current functionality, replaced with
 * moment JS_lib;
 * @see http://momentjs.com/docs/
 */

var from_time_after = [
    {
        target: "Dummy1",
        datapoints: [[33, '20160901'], [61, '20160902'], [25, '20160903'], [96, '20160904'],
            [46, '20160905'], [7, '20160906'], [22, '20160907'], [76, '20160908'],
            [69, '20160909'], [27, '20160910'], [74, '20160911'], [73, '20160912'],
            [97, '20160913'], [16, '20160914'], [43, '20160915'], [74, '20160916'],
            [34, '20160917'], [87, '20160918'], [54, '20160919'], [99, '20160920'],
            [14, '20160921'], [97, '20160922'], [36, '20160923'], [88, '20160924'],
            [58, '20160925'], [59, '20160926'], [43, '20160927'], [65, '20160928'],
            [100, '20160929'], [83, '20160930'], [11, '20160931']]
    }

];
var default_metric_outliers = [
    {
        target: 'dummy.metric.1',
        datapoints: [[72, '20160901'], [34, '20160902'], [39, '20160903'], [63, '20160904'], [17, '20160905'],
            [1000, '20160906'], [-18000, '20160907'], [37, '20160908'], [98, '20160909'], [98, '20160910'], [76, '20160911'],
            [87, '20160912'], [5, '20160913'], [12, '20160914'], [54, '20160915'], [89, '20160916'], [18, '20160917'],
            [55, '20160918'], [54, '20160919'], [52, '20160920'], [67, '20160921'], [5, '20160922'], [41, '20160923'],
            [13, '20160924'], [31, '20160925'], [6100, '20160926'], [87, '20160927'], [4, '20160928']]

    }
];
var expected_metric_outliers = [
    {
        target: 'dummy.metric.1',
        datapoints: [[72, '20160901'], [34, '20160902'], [39, '20160903'], [63, '20160904'], [17, '20160905'],
            [null, '20160906'], [null, '20160907'], [37, '20160908'], [98, '20160909'], [98, '20160910'], [76, '20160911'],
            [87, '20160912'], [5, '20160913'], [12, '20160914'], [54, '20160915'], [89, '20160916'], [18, '20160917'],
            [55, '20160918'], [54, '20160919'], [52, '20160920'], [67, '20160921'], [5, '20160922'], [41, '20160923'],
            [13, '20160924'], [31, '20160925'], [null, '20160926'], [87, '20160927'], [4, '20160928']]

    }
];


var default_metric_month = [
    {
        target: 'dummy.metric.1',
        datapoints: [[72, '20160901'], [34, '20160902'], [39, '20160903'], [63, '20160904'], [17, '20160905'],
            [100, '20160906'], [18, '20160907'], [37, '20160908'], [98, '20160909'], [98, '20160910'], [76, '20160911'],
            [87, '20160912'], [5, '20160913'], [12, '20160914'], [54, '20160915'], [89, '20160916'], [18, '20160917'],
            [55, '20160918'], [54, '20160919'], [52, '20160920'], [67, '20160921'], [5, '20160922'], [41, '20160923'],
            [13, '20160924'], [31, '20160925'], [61, '20160926'], [87, '20160927'], [4, '20160928']]

    }
];

var expected_metric_maxmin = [
    {
        target: 'dummy.metric.1',
        datapoints: [['20160902', '20160901'], ['20160905', '20160906'], ['20160911', '20160909'],
                    ['20160913', '20160916'], ['20160917', '20160918'], ['20160922', '20160921'], ['20160928', '20160927']]

    }
];

var default_metric = [
    {
        target: 'dummy.metric.1',
        datapoints: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] //straight line
    }
];

var metric_expected = [
    {
        target: 'dummy.metric.2',
        datapoints: [[0, 1], [0.25, 2], [0.5, 3], [0.75, 4], [1, 5]]
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


});

describe("Test for normalization", function () {
    let normal = Normalize(default_metric);
    it("Normalize the data set so that it is in a range of -1 to 1", function () {

        expect(normal).toEqual(metric_expected[0].datapoints);

    });

});

describe("Test for getting min and max at a local area of a specified time frame", function () {
    let max_min = FindLocalMaxandMin(default_metric_month, 4);
    it("Max and Min found from specified metrics", function () {

        expect(max_min).toEqual(expected_metric_maxmin[0].datapoints);
    });

});

describe("Test for smoothing out the data set by removing any outliers", function () {
    let smooth = MetricSmoothing(default_metric_outliers, 3);
    it("Max and Min found from specified metrics", function () {

        expect(smooth).toEqual(expected_metric_outliers[0].datapoints);
    });

});
/*
describe("Test for testing out the timeafterfunction", function () {
    let timeafter = indexFromTimeAfter(from_time_after);
    it("Max and Min found from specified metrics", function () {

        expect(timeafter).toEqual(expected_metric_outliers[0].datapoints);
    });

});
    */