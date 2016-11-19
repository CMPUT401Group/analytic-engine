import _ from 'underscore';
import R from 'r-script';
import moment from 'moment';
import MetricsAPIAdapter from './../metrics-api-adapter';
import RenderAPIAdapter from './../render-api-adapter';
import covariance from './../covariance';

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
    var smoothData
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
    R("r-modules/Normalize.R");
    // we want to smooth the data first before we normalize
    // otherwise we will get skewed results
    var metrics = metricSmoothing(metric);
    // data will be in the ranges of -1 to 1?
    return normalized_data;
}

//finds the local max and minimum of a data set, more
//accurate results if we use a normailzed data set
function FindLocalMaxandMin(metric, interval) {
    R("r-modules/interpolatePOI.R");
    var timeInterval = interval;


    //returns max and minimum points for a given
    // periods/intervals over a given time frame
    // Default is 10min periods.
    return maxmin_tuple_list //lists of lists for now.
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
export {Normalize, FindLocalMaxandMin};
