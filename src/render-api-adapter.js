import request from 'sync-request';
import _ from 'underscore';
import {default as requestAsync} from 'request';
import utility from './utility';
import requestretry from 'requestretry'

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
        var self = this;
        var retryTotal = 0;
        requestretry(`${this.graphiteURL}/render?${urlParams}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                callback(body, error);
            }
            //console.log(error,response.statusCode);
            //if (error.code =='ECONNRESET') 
            else {
                retryTotal++;
                if (error.code =='ECONNRESET') {}//ignore this and retry
                else {console.log("Retry Total: ",retryTotal," ", error," ", options);}
                callback(body, error);
                //self.renderAsync(options, callback); 

            } //try again
        });

    }
}   