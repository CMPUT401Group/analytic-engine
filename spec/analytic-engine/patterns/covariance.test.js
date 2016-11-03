//sumSeries(IN.stb-sim.dean.*.Call.{FAIL,PASS}.count)  Calls per second
//alias(scale(sumSeries(IN.stb-sim.dean.*.Call.ERROR.*.count), 0.1), 'ERROR')   Errors per second

//import config from 'config';
import {Covariance} from '../../../src/patterns';


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
	it ('complete correlation', function() {
        let cov = new Covariance(metric1);
        expect(cov.correlation(metric2)).toEqual(1.0); 
        //this is perfectly linearly correlated but moved +1
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

	it ('remove nulls', function() {
        let cov = new Covariance(metric3);
        cov.cleanNulls(metric3[0].datapoints);
        expect(metric3[0].datapoints).toEqual(metric4[0].datapoints);

    })

});

