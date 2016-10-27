// example.js

import R from 'r-script';

var metric1 = [
            {
                target: 'dummy.metric.1',  
                datapoints: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] //straight line
            }
        ];

var metric2 = [                  
			{
                target: 'dummy.metric.2',
                datapoints: [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]] //moved +1 in the y axis from metric1
            }
        ];

// sync
var out = R("r-modules/linear-covariance.R")
    .data(metric1, metric2)
    .callSync();
console.log(out);
