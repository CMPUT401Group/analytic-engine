import request from 'sync-request';
import _ from 'underscore';

import utility from './utility';

// TODO: Handle response errors.

export default class RenderAPIAdapter {
    constructor(graphiteURL) {
        this.graphiteURL = graphiteURL;
    }
}