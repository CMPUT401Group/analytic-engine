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
  getMetrics(timeBegin, timeEnd) {
    let graphiteAdapter = new GraphiteAdapter(graphiteURL);

    var timeBeginUTC = moment(timeBegin).utc().format('HH:mm_YYYYMMDD');
    var timeEndUTC = moment(timeEnd).utc().format('HH:mm_YYYYMMDD');

    console.log(timeBeginUTC, timeEndUTC);

    let metricRes = graphiteAdapter.metrics.findAll();

    let allMetrics = [];
    metricRes.forEach((metric, i) => {
      let renderRes = graphiteAdapter.render.render({
        target: metric,
        format: 'json',
        from: timeBeginUTC,
        until: timeEndUTC,
      });

      allMetrics.push(renderRes);
      console.log(`${i} in ${metricRes.length}`);
    });

    return allMetrics;
  }

  /**
   * @param {Date} timeBegin
   * @param {Date} timeEnd
   */
  train(timeBegin, timeEnd) {
    /*let metrics = this.getMetrics(timeBegin, timeEnd);

    // TODO: Wrap analytic-engine-rl with node so we don't have to do this ugly thing.
    fs.writeFileSync(
      '/tmp/metric.json',
      JSON.stringify(metrics)
    );*/

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