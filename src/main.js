import config from 'config';
import express from 'express';
import _ from 'underscore';
import Fiber from 'fibers';
import moment from 'moment';

import {Covariance} from './patterns';
import RenderAPIAdapter from './render-api-adapter';

import GraphiteAdapter from './graphite-adapter';
import POI from './points-of-interest';
//import {THRESHOLDRULE, Threshold} from './patterns/threshold';

// This will be the main executable.
function main() {
    let app = express();  // TODO: To be used later.

    let graphiteURL = config.get('graphiteURL');
    let mongodPort = config.get('mongodPort');

    /*let graphiteAdapter = new GraphiteAdapter(graphiteURL);
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
    }) */
    
    var render = new RenderAPIAdapter(graphiteURL);
    var renderRes = render.render({
            target: 'IN.stb-sim.dean.RequestTiming.count',
            format: 'json',
            from: '17:00_20160921',
            until: '18:00_20160921',
        });
    var cov = new Covariance(renderRes);

    //1474477210 = 17:00_20160921 
    //var date = moment.unix(1474477210);
    //console.log(date.utc().format('HH:mm_YYYY:MM:DD'));


    console.log("before");
    let fiber = Fiber.current;
    cov.correlationAllMetrics(function(){
        console.log('before fiber.run');
        fiber.run();
        //console.log("after fibder.run ERROR");
    });// takes forever (>30 min) 
    Fiber.yield();

    //at the 15 min mark we get tons of ECONNRESET. Need to handle this and repeat the request. 

    console.log(cov.getMetricDict()); 
    //console.log("finally");



}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();