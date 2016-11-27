import _ from 'underscore';
import R from 'r-script';
import moment from 'moment';
import MetricsAPIAdapter from './metrics-api-adapter';
import RenderAPIAdapter from './render-api-adapter';
import covariance from './patterns/covariance';

// Gets closest time to specified time frame put in by user
// i.e. if user enters 113, but doesn't exist in the data set
// it finds the next closest time stamp as the start point
// applies for both indexFromTimeBefore, and indexFromTimeAfter
function indexFromTimeBefore(metrics){
    //parse starting metric for closest user specified
}

function indexFromTimeAfter(metrics) {
    //parse end metric for closest user specified one
}

//Smooths out the datapoints for a more accurate normalization
// of the data set
function metricSmoothing(metrics){
    var smoothData = R("r-modules/Smoothing.R");
    var cleanmetrics = covariance.cleanNulls(metrics[0]);
    return smoothData
}

/**Normalizes the dataset.
 * @summary https://docs.google.com/document/d/1x0A1nUz1WWtMCZb5oVzF0SVMY7a_58KQulqQVT8LaVA/edit#
 *Normalization: It’s the process of casting the data to the
 *specific range,like between 0 and 1 or between -1 and +1.
 * Normalization is required when there is big differences
 *in the ranges of different features.  This scaling
 * method is useful when the data set does not contain outliers.
*/
function Normalize(metric, timeFrame){
    // we want to smooth the data first before we normalize
    // otherwise we will get skewed results
    //      var metrics = metricSmoothing(out);
    // data will be in the ranges of -1 to 1?
    return R("r-modules/Normalize.R").data(metric[0].datapoints).callSync();
}

//finds the local max and minimum of a data set, more
//accurate results if we use a normailzed data set
function FindLocalMaxandMin(metric, interval=4) {
    // rather go lower in the indexing vs higher, as to avoid
    // index out of range errors
    var array_length = Math.floor((metric[0].datapoints.length)/interval);
    var maxmin_tuple_list = [];
    var datapoints_list = [];
    var i = 0;
    var j = 0;
    // I know this is an inefficient means to do this, but I was
    // experiencing erroneous behaviour from the r-script output
    // therefore I split the interpolationPOI into two R files.
    // as well resorted to javascript loops as well.
    while (i < array_length) {
        while (j < interval){
            datapoints_list.push(metric[0].datapoints.shift());
            j++
        }
        // In the case of duplicate points for local max and min, it always returns
        // the local max or min of the earliest one:
        //
        // i.e. if these two were tied for the max [98, '20160909'], [98, '20160910']
        // it would return with '20160909' as its time (Seen in test case)
        // (Could also alter R code to return more than just a single max and min as well)


        maxmin_tuple_list.push([R("r-modules/min.R").data(datapoints_list).callSync(),
                               R("r-modules/max.R").data(datapoints_list).callSync()]);
        datapoints_list = [];
        j = 0;
        i ++;

    }
    //returns the times of the min and max points for a given
    // periods/intervals over a given time frame
    // Default is 4 data point intervals
    return maxmin_tuple_list ;//lists of lists for now.
}

function generateDashboard(options) {
    let dashboard = {
        title: options.title,
        time: {
            from: options.from,
            to: options.to
        },
        rows: []
    };

    for (let row of options.rows) {
        dashboard.rows.push({
            title: `${row.title}`,
            height: '300px',
            panels: [
                {
                    title: `${row.targetName}`,
                    type: 'graph',
                    span: 12,
                    fill: 1,
                    linewidth: 2,
                    pointradius: 5,
                    points: true,
                    targets: [
                        {
                            'target': `${row.targetName}`
                        }
                    ],
                    tooltip: {
                        shared: true
                    }
                }
            ]
        });
    }

    return dashboard;
}

class Utility {
    objToURLParam(obj) {
        var str = "";
        for (var key in obj) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + encodeURIComponent(obj[key]);
        }
        return str;
    }

    /**
     * Javascript does time_stamp shallow copy when assignment is done with objects.
     * To make deep copy, use this function.
     *
     * @param {Object} obj The javascript to deep copy.
     * @return {Object} Deep copied 'obj'.
     */
    deepCopy(obj) {
        return _.map(obj, _.clone);
    }
}

let utilityInstance = new Utility();
export default utilityInstance;
export {Normalize, FindLocalMaxandMin, generateDashboard};
