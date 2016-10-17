import _ from 'underscore';

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
     * Javascript does a shallow copy when assignment is done with objects.
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