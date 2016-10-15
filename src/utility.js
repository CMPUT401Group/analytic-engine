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
}

let utilityInstance = new Utility();
export default utilityInstance;