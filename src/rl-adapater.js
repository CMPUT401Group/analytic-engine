import fs from 'fs';
import _ from 'underscore';
import config from 'config';
import moment from 'moment';
import child_process from 'child_process';

import GraphiteAdapter from './graphite-adapter';

let spawnSync = child_process.spawnSync;
let graphiteURL = config.get('graphiteURL');
let mongodPort = config.get('mongodPort');
let analyticEngineRLPath = config.get('analytic-engine-rl-cli-path');

export default class RLAdapter {
  acquireMetrics(timeBegin, timeEnd, destFile) {
    let graphiteAdapter = new GraphiteAdapter(graphiteURL);

    var timeBeginUTC = moment(timeBegin).utc().format('HH:mm_YYYYMMDD');
    var timeEndUTC = moment(timeEnd).utc().format('HH:mm_YYYYMMDD');

    let metricRes = graphiteAdapter.metrics.findAll();
    metricRes = metricRes.slice(7000);

    //let allMetrics = [];
    fs.writeFileSync(destFile, '[');
    metricRes.forEach((metric, i) => {
      let renderRes = graphiteAdapter.render.render({
        target: metric,
        format: 'json',
        from: timeBeginUTC,
        until: timeEndUTC,
      });

      if (i != metricRes.length - 1) {
        fs.appendFileSync(destFile, JSON.stringify(renderRes) + ',');
      } else {
        fs.appendFileSync(destFile, JSON.stringify(renderRes));
      }

      console.log(`${i} in ${metricRes.length}`);
    });
    fs.appendFileSync(destFile, ']');

    //return allMetrics;
  }

  /**
   * @param {Date} timeBegin
   * @param {Date} timeEnd
   */
  train(timeBegin, timeEnd) {
    this.acquireMetrics(timeBegin, timeEnd, '/tmp/metric.json');

    console.log(analyticEngineRLPath);
    spawnSync(analyticEngineRLPath, [
      "/tmp/metric.json",
      "/home/jandres/Codes/analytic-engine/config/analytic-engine-rl-config.json"
    ], {
      stdio:[0,1,2]  // Display to the parent's stream.
    });

    return JSON.parse(fs.readFileSync('result.json', {
      encoding: 'utf8'
    }));
  }
}
