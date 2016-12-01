/**
 * @class Pattern
 * @brief Pattern interface/abstract class that all pattern must extend.
 *
 * Contains stuff that needs to implement. See those that throws an exception.
 */
export default class Pattern {
    /**
     * @param {String} type Just the class name. Set via super(<ChildClass>.name) in <ChildClass>'s constractor.
     */
    constructor(type = Pattern.name) {
        this._type = type;
    }

    /**
     * @return The pattern object.
     */
    getPattern() {
        throw new Error(`Child classes should implement ${Pattern.name}:getPattern.`);
    }

    /**
     * Checks how far a given format deviates from this pattern.
     *
     * @description [
     *          {
     *            target: String,
     *            datapoints: [[
     *            Number, Number], ...]
     *          }, ...
     *        ] metrics Grafana json format for metrics.
     * @return Number The closer to 0, the closer is the given metrics to the pattern.
     */
    error(metrics) {
        throw new Error("Child classes should implement Pattern:error");
    }

    /**
     * Serialize the pattern data.
     * @returns {Object}
     */
    serialize() {
        throw new Error(`${Pattern.name}:serialize must be implemented by child classes.`);
    }

    /**
     * @see Pattern.serialize
     * @static
     */
    static serialize(poi) {
        return poi.serialize();
    }

    /**
     * Just something that needs to be implemented for each classes.
     * @static
     */
    static deserialize(serializedPattern) {
        throw new Error(`${Pattern.name} is an abstract class and can't be instantiated.`);
    }
}