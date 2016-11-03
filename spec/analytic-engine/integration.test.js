import config from 'config';

import RenderAPIAdapter from './../../src/render-api-adapter';
import {Covariance} from './../../src/patterns';

let graphiteURL = config.get('graphiteURL');

var renderRes;
var renderRes2;

describe("AnalyticEngine - integration", function() {
    beforeEach(function () {
        this.render = new RenderAPIAdapter(graphiteURL);
    });

    it("find - ensure @see https://graphite-api.readthedocs.io/en/latest/api.html#the-render-api-render", function() {
        renderRes = this.render.render({
            target: 'IN.stb-sim.dean.RequestTiming.count',
            format: 'json',
            from: '17:00_20160921',
            until: '18:00_20160921',
        });
    });
    it("soemthing", function() {
        renderRes2 = this.render.render({
            target: 'IN.stb-sim.dean.ImpressionReport.Impressions.count',
            format: 'json',
            from: '17:00_20160919',
            until: '18:00_20160919',
        });
        expect(renderRes).toBeTruthy();
        expect(renderRes[0]).toBeTruthy();
        expect(renderRes[0].datapoints).toBeTruthy();
        expect(renderRes2[0].datapoints).toBeTruthy();

        let cov = new Covariance(renderRes);
        console.log("correlation: "); 
        console.log(cov.correlation(renderRes2));
        console.log("covariance: "); 
        console.log(cov.covariance(renderRes2));

        console.log(cov.correlationAllMetrics());
        //console.log((cov.getPattern())[0].datapoints);
        //console.log("*****");
        //console.log(renderRes2[0].datapoints);
    });

});

