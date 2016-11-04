import config from 'config';
import express from 'express';
import _ from 'underscore';
import Fiber from 'fibers';

import {Covariance} from './patterns';
import RenderAPIAdapter from './render-api-adapter';


import GraphiteAdapter from './graphite-adapter';
import POI from './points-of-interest';
import {THRESHOLDRULE, Threshold} from './patterns/threshold';

// This will be the main executable.
function main() {
  let app = express();  // TODO: To be used later.

  let graphiteURL = config.get('graphiteURL');
  let mongodPort = config.get('mongodPort');
  let nodejsPort = config.get('nodejsPort');

  let graphiteAdapter = new GraphiteAdapter(graphiteURL);
  let pointsOfInterest = new POI(mongodPort, 'app');

  pointsOfInterest.open();

  app.post('/pattern/threshold', (req, res, next) => {
    let rawThreshold = req.body.threshold;
    rawThreshold = rawThreshold.map(threshold => {
      switch (String(threshold.thresholdRule).trim()) {
        case '<':
          threshold.thresholdRule = THRESHOLDRULE.LESSTHAN;
          break;
        case '<=':
          threshold.thresholdRule = THRESHOLDRULE.LESSTHANEQUAL;
          break;
        case '=':
          threshold.thresholdRule = THRESHOLDRULE.EQUAL;
          break;
        case '>=':
          threshold.thresholdRule = THRESHOLDRULE.GREATERTHANEQUAL;
          break;
        case '>':
          threshold.thresholdRule = THRESHOLDRULE.GREATERTHAN;
          break;
        default:
          var err = new Error('Unknown threshold rule.');
          err.status = 500;
          next(err);
      }

      return threshold;
    });

    let threshold = new Threshold(rawThreshold);
    pointsOfInterest.insert([threshold]);

    res.send('Success');
  });

  app.get('/pattern/threshold', (req, res) => {
    pointsOfInterest.findAllThresholdAsync().then(thresholds => res.json(thresholds));
  });

  app.get('/pattern', (req, res) => {
    res.json([]);
  });

  app.listen(nodejsPort, function () {
    console.log('Example app listening on port: ',nodejsPort);
  });
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();
