

/**
 * @class Covariance
 * @brief Given a time-range of data in a metric, find other metrics which are most linearly correlated to the
 * change observed over that period	
 * @extends Pattern
 */
class Covariance extends Pattern {

    /**
     * Rules/patterns given are all treated as 'AND'. That is all rules/patterns
     * must be satisfied in order for error to be 0.
     *
     * @param [
     *          {
     *            target: String,
     *            covarianceSet: COVARIANCESET
     *            value: Number
     *          },
     *          ...
     *        ] covarainceSet of values which are to be used for comparison
     */
	constructor(covarianceSet) {
        super(Covariance.name);

        this.covarianceSet = covarianceSet;
    }

    /**
     * @see Pattern.getPattern
     */
    getPattern() {
        return this.covarianceSet;
    }

    /**
     * @see Pattern.error
     */
    error(metrics) {
        
//TODO: actually send stuff to R and get a covariance value back. Probably return the absolute value of it. 
        return 0
    }


    /**
     * @returns {{pattern: Object, _type: String }} Serialized covarianceSet pattern.
    */
    serialize() {
        // We don't want to modify this.pattern thus deep Copy it first.
        let clonedPattern = utility.deepCopy(this.getPattern());

        // Class can't be serialized.
        clonedPattern.forEach(pattern => {
            pattern.covarianceSet = serializeCOVARIANCESET(pattern.covarianceSet)
        });

        let serializedPattern = {
            pattern: clonedPattern,
            _type: this._type
        };
        return serializedPattern;
    }

    /**
     * @see Pattern.deserialize
     * @static
     * @param {Object} serializedPattern A serialized Threshold pattern.
     * @returns {Covariance} covariance instance.
     */
    static deserialize(serializedPattern) {
        serializedPattern.pattern.forEach(pattern => {
            pattern.covarianceSet = deserializeCOVARIANCESET(pattern.covarianceSet);
        });

        return new Covariance(serializedPattern.pattern);
    }
}




import R from 'r-script';

// sync
var out = R("r-modules/hello-world.R")
    .data("hello world", 20)
    .callSync();
console.log(out);