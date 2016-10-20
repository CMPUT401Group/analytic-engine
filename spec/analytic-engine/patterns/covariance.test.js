//sumSeries(IN.stb-sim.dean.*.Call.{FAIL,PASS}.count)  Calls per second
//alias(scale(sumSeries(IN.stb-sim.dean.*.Call.ERROR.*.count), 0.1), 'ERROR')   Errors per second



import config from 'config';

import RenderAPIAdapter from './../../src/render-api-adapter';

let graphiteURL = config.get('graphiteURL');

// TODO: Make an integration or acceptance testing folder. This test
//       is more like an acceptance testing.

describe("AnalyticEngine - RenderAPIAdapter", function() {
    beforeEach(function () {
        this.render = new RenderAPIAdapter(graphiteURL);
    });

    it("find - ensure @see https://graphite-api.readthedocs.io/en/latest/api.html#the-render-api-render", function() {
        let renderRes = this.render.render({
            target: 'collectd.cassandra1.cpu-1.cpu-system',
            format: 'json',
            from: '16:00_20160901',
            until: '18:00_20160901',
        });
        console.log(renderRes);
        console.log(renderRes[0]);
        console.log(renderRes[0].datapoints);
        expect(renderRes).toBeTruthy();
        expect(renderRes[0]).toBeTruthy();
        expect(renderRes[0].datapoints).toBeTruthy();
    });
});