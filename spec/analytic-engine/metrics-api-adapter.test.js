import config from 'config';

import MetricsAPIAdapter from './../../src/metrics-api-adapter';

let graphiteURL = config.get('graphiteURL');

// TODO: Make an integration or acceptance testing folder. This test
//       is more like an acceptance testing.

describe("AnalyticEngine - MetricsAPIAdapter", function() {
    beforeEach(function() {
        this.metrics = new MetricsAPIAdapter(graphiteURL);
    });

    it("find - ensure @see https://graphite-api.readthedocs.io/en/latest/api.html#metrics-find", function() {
        expect(this.metrics.find({ query: '*' }).length).toBeTruthy();
    });

    it("expand - ensure @see https://graphite-api.readthedocs.io/en/latest/api.html#metrics-index-json", function() {
        expect(this.metrics.expand({ query: 'collectd.*' }).results.length).toBeTruthy();
    });

    it("findAll - ensure @see https://graphite-api.readthedocs.io/en/latest/api.html#metrics-index-json", function() {
        expect(this.metrics.findAll().length).toBeTruthy();
    });
});