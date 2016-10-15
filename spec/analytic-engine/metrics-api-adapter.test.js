import MetricsAPIAdapter from './../../src/metrics-api-adapter';

// TODO: Place this in a config file.
let graphiteURL = "http://162.246.157.107";

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