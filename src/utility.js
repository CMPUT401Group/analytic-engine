import _ from 'underscore';
function EpochToDate(Unix_Timestamp) {
    // Using absolute date format of HH:MM:SS_YYYYMMDD
    // I'm aware there is an more elegant solution, but this one
    // is better at showing whats going on.

    //Converts timestamp to milliseconds
    var time_stamp = new Date(Unix_Timestamp * 1000);

    //gets full year (all four digits)
    var year = time_stamp.getFullYear();

    //gets month, adds one as getmonth() function sets Jan = 0 and Dec = 11
    //concatenates '0' to get proper formatting for render api
    var month = time_stamp.getMonth() + 1;
    if (month < 10) {
        month = '0'+ month;
    }

    //concatenates '0' to get proper formatting for render api
    var date = time_stamp.getDate();
    if (date < 10) {
        date = '0' + date;
    }

    //concatenates '0' to get proper formatting for render api
    var hour = time_stamp.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }

    //concatenates '0' to get proper formatting for render api
    var min = time_stamp.getMinutes();
    if (min < 10) {
        min = '0' + min;
    }

    //concatenates '0' to get proper formatting for render api
    var sec = time_stamp.getSeconds();
    if (sec < 10) {
        sec = '0' + sec;
    }
    // returns string of proper date formatting
    var time = hour + ':' + min + ':' + sec + '_' + year + '' + month + '' + date;
    return time;

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
export {EpochToDate};
