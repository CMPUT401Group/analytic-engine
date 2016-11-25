import config from 'config';

import RenderAPIAdapter from './../../src/render-api-adapter';
import {Covariance} from './../../src/patterns';

/**
 * @description Test suite for render-api-adapter.js and covariance.js:
 * Utilizing jasmine as our Javascript testing framework
 * {@tutorial https://jasmine.github.io/2.5/introduction}
 */


let graphiteURL = config.get('graphiteURL');

var renderRes1;
var renderRes2;

describe("AnalyticEngine - integration", function() {
    beforeEach(function () {
        this.render = new RenderAPIAdapter(graphiteURL);
    });

    it("find - ensure @see https://graphite-api.readthedocs.io/en/latest/api.html#the-render-api-render", function() {
        renderRes1 = this.render.render({
            target: 'invidi.webapp.localhost_localdomain.request.total_response_time.mean',
            format: 'json',
            from: '11:00_20160917',
            until: '11:30_20160917',
        });

        renderRes2 = this.render.render({
            target: 'invidi.webapp.localhost_localdomain.database.request.findEtl.error_gauge',
            format: 'json',
            from: '11:00_20160917',
            until: '11:30_20160917',
        });

        var cov = new Covariance(renderRes1);
        //console.log("Covariance",cov.covariance(renderRes2),"correlation", cov.correlation(renderRes2));
        //console.log("data",renderRes2[0].datapoints);

    });
    /*
    it("something", function(done) {
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

        this.render.renderAsync({
            target: 'IN.stb-sim.dean.ImpressionReport.Impressions.count',
            format: 'json',
            from: '17:00_20160919',
            until: '18:00_20160919',
        },function(result, error){
            //console.log(result);
            expect(result).toBeTruthy();
            expect(result[0]).toBeTruthy();
            expect(result[0].datapoints).toBeTruthy();
            done();
        }); 

        //console.log(cov.correlationAllMetrics( ()=> done() ));// takes forever (>30 min)

    }); */

});

