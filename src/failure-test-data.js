import Fiber from 'fibers';
import moment from 'moment';
import fs from 'fs';

import RLAdapter from './rl-adapater';
import {generateDashboard} from './utility';

// This will be the main executable.
function main() {
  let timeBegin = new Date(Date.UTC(2016, 8, 17, 11, 1, 0));
  let timeEnd = new Date(Date.UTC(2016, 8, 17, 11, 26, 0));
  let result = (new RLAdapter).train(timeBegin, timeEnd);

  // todo: move this job to c++
  result = result.filter(r => r.reward != null);
  result = result.sort((a, b) => {
    return b.reward - a.reward;
  });

  result = result.slice(0, 40);

  var timeBeginUTC = moment(timeBegin).utc().format('YYYY-MM-DD HH:mm:ss');
  var timeEndUTC = moment(timeEnd).utc().format('YYYY-MM-DD HH:mm:ss');
  let dashboardOptions = {
    title: 'Reinforcement Learning Model for response time',
    from: timeBeginUTC,
    to: timeEndUTC,
    rows: []
  };
  dashboardOptions.rows = result.map(r => {
    return {
      title: `${r.sourcePattern.metric} - ${r.reward}`,
      targetName: r.sourcePattern.metric
    };
  });

  dashboardOptions.rows.unshift({
    title: "invidi.webapp.localhost_localdomain.request.total_response_time.mean",
    targetName: "invidi.webapp.localhost_localdomain.request.total_response_time.mean"
  });

  fs.writeFileSync(
    'metric.json',
    JSON.stringify(generateDashboard(dashboardOptions))
  );
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();
