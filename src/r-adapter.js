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
                datapoints: [[0, 6], [1, 7], [2, 8], [3, 9], [4,10]] //moved +1 in the y axis from metric1
            }
        ];



// sync
var out = R("r-modules/linear-covariance.R")
    .data(metric1[0].datapoints, metric2[0].datapoints)
    .callSync();
console.log(out);
