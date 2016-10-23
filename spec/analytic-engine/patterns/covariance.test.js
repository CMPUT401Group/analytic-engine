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

describe("AnalyticEngine - Patterns - Covariance", function() {
	it ('constructor setups the Pattern._type', function() {
        let cov = new Covariance(metric1);
        expect(cov._type).toEqual('Covariance');
    });

	it ('getPattern() returns the metric', function() {
        let cov = new Covariance(metric2);
        expect(cov.getPattern()).toEqual(metric2);
    }); 

	it ('error does something', function() {
        let cov = new Covariance(metric1);
        //this is really only testing that something comes back from R
        //we will have to change this
        expect(cov.error(metric2)).toEqual(2.7778); //I don't know that this number has any value
    });


});

