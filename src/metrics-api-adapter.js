import request from 'sync-request';
import _ from 'underscore';

import utility from './utility';

// TODO: Handle response errors.

/**
 * @class MetricsAPIAdapter
 * @brief @see https://graphite-api.readthedocs.io/en/latest/api.html#the-metrics-api
 */
export default class MetricsAPIAdapter {
    /**
     * Constructor for MetricsAPIAdapter
     * @param graphiteURL The url of the graphite HTTP API.
     */
    constructor(graphiteURL) {
        this.graphiteURL = graphiteURL;
    }

    /**
     * GET /metrics/find
     * @see https://graphite-api.readthedocs.io/en/latest/api.html#metrics-find
     *
     * @param options
     */
    find(options) {
        let urlParams = utility.objToURLParam(options);
        let res = request('GET', `${this.graphiteURL}/metrics/find?${urlParams}`);
        return JSON.parse(res.getBody('utf8'));
    }

    /**
     * GET /metrics/expand
     * @see https://graphite-api.readthedocs.io/en/latest/api.html#metrics-expand
     *
     * @param options
     */
    expand(options) {
        let urlParams = utility.objToURLParam(options);
        let res = request('GET', `${this.graphiteURL}/metrics/expand?${urlParams}`);
        return JSON.parse(res.getBody('utf8'));
    }

    /**
     * GET /metrics/index.json
     * @see https://graphite-api.readthedocs.io/en/latest/api.html#metrics-index-json
     *
     * @param options
     */
    findAll(options = {}) {
        let urlParams = utility.objToURLParam(options);
        let res = _.isEmpty(options) ?
            request('GET', `${this.graphiteURL}/metrics/index.json`) :
            request('GET', `${this.graphiteURL}/metrics/index.json?${urlParams}`);
        return JSON.parse(res.getBody('utf8'));
    }
}