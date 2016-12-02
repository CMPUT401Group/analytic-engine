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
    graphiteAdapter.renderAllMetrics(timeBegin, timeEnd, destFile);
  }

  /**
   * @param {Date} timeBegin
   * @param {Date} timeEnd
   */
  train(config) {
    let metricFile = '/tmp/metric.json';
    let configFile = '/tmp/analytic-engine-rl-config.json';

    this.acquireMetrics(config.timeBegin, config.timeEnd, metricFile);

    fs.writeFileSync(configFile, JSON.stringify(config));

    let statSyncResult = fs.statSync(analyticEngineRLPath);
    if (!statSyncResult.isFile()) {
      console.error("Error: config's analytic-engine-rl-cli-path should be set to the path of analytic-engine-rl executable.");
    }
    spawnSync(analyticEngineRLPath, [ metricFile, configFile ], {
      stdio:[0,1,2]  // Display to the parent's stream.
    });

    return JSON.parse(fs.readFileSync(config.resultFile, {
      encoding: 'utf8'
    }));
  }
}
