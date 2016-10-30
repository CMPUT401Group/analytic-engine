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
                datapoints: [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]] //moved +1 in the y axis from metric1
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

describe("AnalyticEngine - Patterns - Covariance", function() {
	it ('constructor setups the Pattern._type', function() {
        let cov = new Covariance(metric1);
        expect(cov._type).toEqual('Covariance');
    });

	it ('getPattern() returns the metric', function() {
        let cov = new Covariance(metric2);
        expect(cov.getPattern()).toEqual(metric2);
    }); 

	it ('correlation', function() {
        let cov = new Covariance(metric1);
        expect(cov.correlation(metric2)).toEqual(0.9623); 
    });

	it ('complete correlation', function() {
        let cov = new Covariance(metric1);
        expect(cov.correlation(metric1)).toEqual(1.0); 
    });

	it ('Covariance', function() {
        let cov = new Covariance(metric1);
        expect(cov.covariance(metric1)).toEqual(2.5); //I have not checked this by hand. 
    });

	it ('remove nulls', function() {
        let cov = new Covariance(metric3);
        cov.cleanNulls(metric3[0].datapoints);
        expect(metric3[0].datapoints).toEqual(metric4[0].datapoints);

    })


});

