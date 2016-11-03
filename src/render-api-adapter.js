import request from 'sync-request';
import _ from 'underscore';
import {default as requestAsync} from 'request';
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

    renderAsync(options, callback) {
        let urlParams = utility.objToURLParam(options);
        requestAsync(`${this.graphiteURL}/render?${urlParams}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
            }
            
            //console.log(error,response.statusCode);
            callback(body, error);
        });

    }
}