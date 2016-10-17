import config from 'config';
import express from 'express';
import _ from 'underscore';
import Fiber from 'fibers';


import GraphiteAdapter from './graphite-adapter';
import POI from './points-of-interest';
import {THRESHOLDRULE, Threshold} from './patterns/threshold';

// This will be the main executable.
function main() {
    let app = express();  // TODO: To be used later.

    let graphiteURL = config.get('graphiteURL');
    let mongodPort = config.get('mongodPort');

    let graphiteAdapter = new GraphiteAdapter(graphiteURL);
    let pointsOfInterest = new POI(mongodPort, 'app');

    pointsOfInterest.open();

    let dataOfInterest = graphiteAdapter.render.render({
        target: 'removeBelowValue(invidi.webapp.localhost_localdomain.request.*.mean, 5)',
        format: 'json',
        from: '11:00_20160917',
        until: '22:00_20160917',
        yMin: 5
    });
    dataOfInterest.forEach(data => {
        data.datapoints = data.datapoints.filter(point => {
            return !_.isNull(point[0])
                ;
        });
    });

    // Playing with threshold pattern.
    // TODO: Target should be able to take graphite wildcards. Let's try to achieve atomic features for now.
    // todo: array checks for threshold.
    // todo: Pattern is parameter to points-of-interest.
    let threshold = new Threshold([{
        target: 'invidi.webapp.localhost_localdomain.request.total_response_time.mean',
        thresholdRule: THRESHOLDRULE.GREATERTHAN,
        value: 5
    }, {
        target: 'invidi.webapp.localhost_localdomain.request.PlaylistRequest.mean',
        thresholdRule: THRESHOLDRULE.GREATERTHAN,
        value: 5
    }]);
    console.log('Testing error:');
    console.log(threshold.error(dataOfInterest) == 0);
    console.log('End Testing error***');

    pointsOfInterest.insert(dataOfInterest);
    pointsOfInterest.removeAll();
    pointsOfInterest.close();
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();