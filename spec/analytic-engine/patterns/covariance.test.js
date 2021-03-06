//sumSeries(IN.stb-sim.dean.*.Call.{FAIL,PASS}.count)  Calls per second
//alias(scale(sumSeries(IN.stb-sim.dean.*.Call.ERROR.*.count), 0.1), 'ERROR')   Errors per second

//import config from 'config';
import {Covariance} from '../../../src/patterns';
/**
 * @description Test suite for covariance.js:
 * Utilizing jasmine as our Javascript testing framework
 * {@tutorial https://jasmine.github.io/2.5/introduction}
 */

var metric1 = [
            {
                target: 'dummy.metric.1',  
                datapoints: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] //straight line
            }
        ];

var metric2 = [                  
			{
                target: 'dummy.metric.2',
                datapoints: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]] //moved +1 in the x axis from metric1
            }
        ];

var metric3 = [                  
			{
                target: 'dummy.metric.nulls',
                datapoints: [["null", 2], [null, 3], [2, 4], [3, 5], [4, 6]] 
            }
        ];

var metric32 = [                  
            {
                target: 'dummy.metric.nulls2',
                datapoints: [["null", 2], [null, 3], [2, 4], [3, 5], [4, 6]] 
            }
        ];

var metric3NoNulls = [                  
            {
                target: 'dummy.metric.nulls',
                datapoints: [ [2, 4], [3, 5], [4, 6]] 
            }
        ];
 
var metric4 = [                  
			{
                target: 'dummy.metric.nullResults',
                datapoints: [[0, 2], [0, 3], [2, 4], [3, 5], [4, 6]] 
            }
        ];
var metric5 = [                  
            {
                target: 'dummy.metric.5',
                datapoints: [[5, 1], [4, 2], [3, 3], [2, 4], [1, 5]] 
            }
        ];
var metric6 = [                  
            {
                target: 'dummy.metric.6',
                datapoints: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]] 
            }
        ];
var metric7 = [                  
            {
                target: 'dummy.metric.10Points',
                datapoints: [[0, 1], [5, 2], [10, 3], [15, 4], [20, 5],[25, 6],
                            [30, 7], [35, 8], [20, 9], [40, 10]] 
            }
        ];

describe("AnalyticEngine - Patterns - Covariance", function() {
/*------------------------------------------------------------------------
    contructor and simple get/sets
------------------------------------------------------------------------*/

	it ('constructor setups the Pattern._type', function() {
        let cov = new Covariance(metric1);
        expect(cov._type).toEqual('Covariance');
    });
	it ('getting attributes works', function() {
        let cov = new Covariance(metric4);
        expect(cov.getPattern()).toEqual(metric4);
        expect(cov.getStartTime()).toEqual(2);
        expect(cov.getEndTime()).toEqual(6);
    }); 

/*------------------------------------------------------------------------
    correlation and covariance
------------------------------------------------------------------------*/
    describe("async test", function() {
        var returnedResult;
        beforeEach(function(done) {
            let cov = new Covariance(metric1);
            cov.correlationAsync(metric2).then(function(result){
                returnedResult = result;
                done();
            }), function(err){
                throw err;
                }
        });
	   it ('complete correlation', function() {
            expect(returnedResult).toEqual(1.0); 
        });

    });
    
    
	it ('negative correlation', function() {
        let cov = new Covariance(metric1);
        expect(cov.correlation(metric5)).toEqual(-1);
    });
    it ('flat line correlation', function() {
        let cov = new Covariance(metric1);
        expect(cov.correlation(metric6)).toEqual('NA'); 
    }); 
	it ('Covariance', function() {
        let cov = new Covariance(metric1);
        expect(cov.covariance(metric1)).toEqual(2.5); //I have not checked this by hand.
    });
    it ('negative covariance', function() {
        let cov = new Covariance(metric1);
        expect(cov.covariance(metric5)).toEqual(-2.5); 
    });
    it ('flat line covariance', function() {
        let cov = new Covariance(metric1);
        expect(cov.covariance(metric6)).toEqual(0); 
    });
    it ('deviation metric', function() {
        let cov = new Covariance(metric1);
        expect(cov.metricDeviation(metric1,1)).toEqual([1,5]); 
    });
    it('Normalization test covariance', function() {
        let cov = new Covariance(metric1);
        expect(cov.covariance(metric1,1)).toEqual(cov.covariance(metric1,1));
    });
    it ('Normalization test correlation', function() {
        let cov = new Covariance(metric1);
        expect(cov.correlation(metric5,1)).toEqual(-1);
    });

//the following tests are using the metric and render APIs (they are not true unit tests!) 
//Moved this to integration test because it needs API input as well. 
/*
    it ('check all metrics for correlation', function() {
        let cov = new Covariance(metric1);
        console.log(cov.correlationAllMetrics());
        //expect(cov.covariance(metric6)).toEqual(0); 
    });
*/

/*------------------------------------------------------------------------
    data manipulation/sanitization
------------------------------------------------------------------------*/

	it ('Replacing nulls with 0', function() {
        let cov = new Covariance(metric3);
        cov.cleanNulls(metric3[0].datapoints);
        expect(metric3[0].datapoints).toEqual(metric4[0].datapoints);

    });

    it ('remove nulls', function() {
        let cov = new Covariance(metric3);
        cov.cleanNulls(metric32[0].datapoints,1);
        expect(metric32[0].datapoints).toEqual(metric3NoNulls[0].datapoints);

    });

    it ('interpolate points', function() {
        let cov = new Covariance(metric3);
        var points = cov.interpolatePoints(metric3[0].datapoints, metric7[0].datapoints);
        expect(points[0].length).toEqual(points[1].length);

    });

});

