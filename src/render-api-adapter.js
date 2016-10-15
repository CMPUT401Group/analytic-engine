import request from 'sync-request';
import _ from 'underscore';

import utility from './utility';

// TODO: Handle response errors.

/**
 * @class RenderAPIAdapter
 * @brief @see https://graphite-api.readthedocs.io/en/latest/api.html#the-render-api-render
 */
export default class RenderAPIAdapter {
    constructor(graphiteURL) {
        this.graphiteURL = graphiteURL;
    }

    /**
     * GET /render
     * @see https://graphite-api.readthedocs.io/en/latest/api.html#the-render-api-render
     *
     * @param options
     */
    render(options) {
        let urlParams = utility.objToURLParam(options);
        let res = request('GET', `${this.graphiteURL}/render?${urlParams}`);
        return JSON.parse(res.getBody('utf8'));
    }
}