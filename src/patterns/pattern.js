/**
 * @class Pattern
 * @brief
 */
export default class Pattern {
    constructor() {}

    /**
     * Checks how far a given format deviates from this pattern.
     *
     * @param [
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
}