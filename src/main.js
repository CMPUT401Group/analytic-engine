import config from 'config';
import express from 'express';
import _ from 'underscore';
import Fiber from 'fibers';

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
  let nodejsPort = config.get('nodejsPort');

  let graphiteAdapter = new GraphiteAdapter(graphiteURL);
  let pointsOfInterest = new POI(mongodPort, 'app');

  pointsOfInterest.open();

  app.post('/pattern/threshold', (req, res) => {

  });

  app.get('/pattern/threshold', (req, res) => {
    res.json(pointsOfInterest.findAllThreshold());
  });

  app.get('/pattern', (req, res) => {
    res.json([]);
  });

  app.get('/call/:mdate1/:mdate2/:m1/:m2/:func',function(req, res)  
  {
      console.log("we got a get from SAM");
      var mdate1 = req.parms.mdate1;
      var mdate2 = req.parms.mdate2;
      var m1 = req.parms.m1;
      var m2 = req.parms.m2;
      var func = req.params.func; 

      //parse the dates
      var start = moment.unix(mdate1).utc().format('HH:mm_YYYYMMDD');
      var end = moment.unix(mdate2).utc().format('HH:mm_YYYYMMDD');

      //resolve the metrics into their respective datapoints
      var render = new RenderAPIAdapter(graphiteURL);
      var renderRes1 = render.render({
            target: m1,
            format: 'json',
            from: start,
            until: end,
        });
      var renderRes2 = render.render({
            target: m2,
            format: 'json',
            from: start,
            until: end,
        });

      //apply the requested function and return the result
      var cov = new Covariance(renderRes1);
      if (func = 'covariance'){
        return cov.covariance(renderRes2);
      }
      else if (func = 'correlation'){
        return cov.correlation(renderRes2);
      }
      else return "invalid request: function should be correlation or covariance"
  });

  app.listen(nodejsPort, function () {
    console.log('Example app listening on port: ',nodejsPort);
  });
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();
