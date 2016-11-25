import config from 'config';
import express from 'express';
import _ from 'underscore';
import Fiber from 'fibers';
import bodyParser from 'body-parser';
import moment from 'moment';
import {Covariance} from './patterns';
import RenderAPIAdapter from './render-api-adapter';


import GraphiteAdapter from './graphite-adapter';
import POI from './points-of-interest';
import {THRESHOLDRULE, Threshold} from './patterns/threshold';

// This will be the main executable.
function main() {
  let app = express();  // TODO: To be used later.

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  let graphiteURL = config.get('graphiteURL');
  let mongodPort = config.get('mongodPort');
  let nodejsPort = config.get('nodejsPort');

  let graphiteAdapter = new GraphiteAdapter(graphiteURL);
  let pointsOfInterest = new POI(mongodPort, 'app');

  pointsOfInterest.open();

  app.post('/pattern/threshold', (req, res, next) => {
    let rawThreshold = req.body.threshold;
    rawThreshold = rawThreshold.map(threshold => {
      switch (threshold.thresholdRule) {
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
    pointsOfInterest.insertAsync([threshold]).then(() => res.send('Success'));
  });

  app.get('/pattern/threshold', (req, res) => {
    pointsOfInterest.findAllThresholdAsync().then(thresholds => res.json(thresholds));
  });

  app.get('/pattern', (req, res) => {
    res.json([]);
  });

  app.get('/call/:mdate1/:mdate2/:m1/:m2/:func',function(req, res)  
  {
      /*var mdate1 = req.parms.mdate1;
      var mdate2 = req.parms.mdate2;
      var m1 = req.parms.m1;
      var m2 = req.parms.m2;
      var func = req.params.func; */
      res.json(req);
  });

  app.get('/call',function(req, res)  
  {
      var func = req.query.func; 
      var mdate1 = req.query.mdate1;
      var mdate2 = req.query.mdate2;
      var m1 = req.query.m1;
      var m2 = req.query.m2;
    
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
if (func = '0'){
    var result1 = cov.covariance(renderRes2);
    var jsonstring = JSON.stringify({        
        r1:result1
    });
    res.json(jsonstring);

}
else if (func = '1'){

    var result2 = cov.correlation(renderRes2);
    var jsonstring = JSON.stringify({        
        r2:result2
    });
    res.json(jsonstring);

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
