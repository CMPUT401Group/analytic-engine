import config from 'config';
import express from 'express';
import _ from 'underscore';
import Fiber from 'fibers';


import GraphiteAdapter from './graphite-adapter';
import POI from './points-of-interest';

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
            return !_.isNull(point[0]);
        });
    });

    pointsOfInterest.insert(dataOfInterest);
    pointsOfInterest.removeAll();
    pointsOfInterest.close();
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();