import _ from 'underscore';
import R from 'r-script';
import moment from 'moment';
import MetricsAPIAdapter from './metrics-api-adapter';
import RenderAPIAdapter from './render-api-adapter';
import covariance from './patterns/covariance';
/**
 * @class utility
 * @classdesc This class provides extra functionality to the statistical analysis of the system, such as normalization,
 * outlier removal (smoothing), metric length realignment, and finding local min and max. As well functionality such as
 * converting data from a json data file into a json file readable by grafana so that it is able to be displayed on
 * a dashboard. As well converting a data object to a readable URL for get and send requests from graphite.
 */
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
/**
 * @function indexFromTimeBefore
 * @brief Gets closest time to specified time frame put in by user
 * Example i.e. if user enters 113, but doesn't exist in the data set
 * it finds the next closest time stamp as the start point
 * applies for both indexFromTimeBefore, and indexFromTimeAfter
 */
function indexFromTimeBefore(metrics){
    //parse starting metric for closest user specified
    return metrics[0].datapoints;
}
/**
 * @function indexFromTimeAfter
 * @brief Gets closest time to specified time frame put in by user
 * Example i.e. if user enters 113, but doesn't exist in the data set
 * it finds the next closest time stamp as the start point
 * applies for both indexFromTimeBefore, and indexFromTimeAfter
 */
function indexFromTimeAfter(metrics) {
    //parse end metric for closest user specified one
    console.log(metrics[0].datapoints[0][1]);
    return metrics[0].datapoints[0][1];
}
/**
 * @function MetricSmoothing
 * @brief Smooths out the datapoints for a more accurate normalization
 * of the data set. Does this by the user specifiying the number of outliers
 * to remove upon using the function. Default is top 3 outliers.
 * The outlier removal applies to both largely deviant positive and negative values.
 * Example: MetricSmoothing(Metrics, loop [# of outliers to be removed])
 * input: [[1000, '20160906'], [-18000, '20160907'], [37, '20160908']....]
 * output: [[null, '20160906'], [null, '20160907'], [37, '20160908']....]
 */

function MetricSmoothing(metrics, loop=3){
    var i = 1;
    var smoothData = R("r-modules/Smoothing.R").data(metrics[0].datapoints).callSync();

    while (i < loop){
        smoothData = R("r-modules/Smoothing.R").data(smoothData).callSync();
        i++;
    }
    for (var j = 0; j < smoothData.length; j++) {
        if(smoothData[j][0] == null){
            smoothData[j][0] = null;
        }
        else {
            smoothData[j][0] = Number(smoothData[j][0]);
        }
    }
    //var cleanmetrics = covariance.cleanNulls(metrics[0]);
    return smoothData
}

/**
 * @function Normalize
 * @brief Normalizes the dataset.
 * https://docs.google.com/document/d/1x0A1nUz1WWtMCZb5oVzF0SVMY7a_58KQulqQVT8LaVA/edit#
 * Normalization: It’s the process of casting the data to the
 * specific range,like between 0 and 1 or between -1 and +1.
 * Normalization is required when there is big differences
 * in the ranges of different features.  This scaling
 * method is useful when the data set does not contain outliers.
 * Currently using this normalization formula: z(i) = (x(i)-min(x))/max(x)-min(x)
 * In which z(i) stands for the normalized value of x at position i, x(i), and
 * with min(x) and max(x) representing the min and max values of the given
 * set of metrics.
 * @return {Array}
 */
function Normalize(metric){
    // we want to smooth the data first before we normalize
    // otherwise we will get skewed results. (Perhaps add a flag for this?
    // Or have this be developer specified?)
    var normalized_data = R("r-modules/Normalize.R")
        .data(metric[0].datapoints)
        .callSync();

    // data will be in the ranges of -1 to 1
    for (var i = 0; i < normalized_data.length; i++) {
        if(normalized_data[i][0] == null){
            normalized_data[i][0] = null;
        }
        else {
            normalized_data[i][0] = Number(normalized_data[i][0]);
        }
    }

    return normalized_data;
}

/**
 * @function FindLocalMaxandMin
 * @brief Finds the times of the local max and minimum of a data set, given a user entered interval of points separation.
 * If there are two of the same max or min values within an interval it will return the first one found in the data set
 * Example: input: FindLocalMaxandMin( [[97, '20160909'], [98, '20160910'], [87, '20160911'], [5, '20160912']...., interval = 4)
 *          output: [['20160912','20160910']], ['20160913'.....]....]]
 *          With a format of [[min, max], [min, max]...etc.
 * @returns {Array}
 */
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
            j++;
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
    // returns the times of the min and max points for a given
    // periods/intervals over a given time frame
    // Default is 4 data point intervals
    return maxmin_tuple_list ;//lists of lists for now.
}
/**
 * @function generateDashboard
 * @brief This function takes in a json file, breaks it down into a format readable by the grafana dashboard importer
 * and uploads this now converted file to be viewed.
 */

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

let utilityInstance = new Utility();
export default utilityInstance;
export {Normalize, FindLocalMaxandMin, generateDashboard, MetricSmoothing, indexFromTimeAfter, indexFromTimeBefore};
