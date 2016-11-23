import request from 'sync-request';
import _ from 'underscore';
import {default as requestAsync} from 'request';
import utility from './utility';
import requestretry from 'requestretry'
import Fiber from 'fibers';

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

    /**
     * Does "render" request to graphite asynchronously.
     * @see https://graphite-api.readthedocs.io/en/latest/api.html#the-render-api-render
     * @param options
     * @param callback
     * TODO(jandres): Wrap this in Promise instead of dealing with callback.
     */
    renderAsync(options, callback) {
        let urlParams = utility.objToURLParam(options);
        requestretry({
            url:`${this.graphiteURL}/render?${urlParams}`,
            maxAttempts: 10,   // (default) try 10 times
            retryDelay: 1000,  // (default) wait for 5s before trying again
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                callback(body, error);
            } else {
                callback(body, error);
            } //try again
        });
    }

    /**
     * Given a list of render/ request.
     * @param metrics [
     *   {
     *     target: String,
     *     format: String,
     *     from: Number,
     *     until: Number
     *   }
     * ] A list of render request.
     * @param logProgress If true, logs progress in console.
     * @returns Promise that if success returns Array of metrics.
     */
    renderMetrics(metrics, logProgress = true) {
        let fiber = Fiber.current;
        let promises = [];
        let i = 0;
        metrics.forEach(metric => {
            let promise = new Promise((resolve, reject) => {
                this.renderAsync(metric, (body, error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(body);
                    }

                    if (logProgress) {
                        console.log(`${i++} in ${metrics.length}`);
                    }
                })
            });

            promises.push(promise);
        });

        let result = null;
        Promise.all(promises).then(r => {
            result = r;
            fiber.run();
        });

        Fiber.yield();
        return result;
    }
}   