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
            from: '20160901',
            until: '20160929',
        });
        expect(renderRes).toBeTruthy();
        expect(renderRes[0]).toBeTruthy();
        expect(renderRes[0].datapoints).toBeTruthy();
    });
});