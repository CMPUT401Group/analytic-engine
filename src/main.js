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
    pointsOfInterest.close();

    app.post('/pattern/threshold', (req, res) => {
        console.log(req);
    });

    app.get('/pattern', (req, res) => {
        res.json([]);
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!')
    })
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();