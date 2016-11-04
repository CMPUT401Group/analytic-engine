import './threshold'
//will try to implement this pattern to prevent redundancy
import Pattern from './pattern'
//Needs this in order to become part of the patterns


class ResourceUsage extends Pattern {

	constructor(resourceMetric){
		super(ResourceUsage.name)
        this.resourceMetric = resourceMetric
	}
//TODO: initialize all the parameters below!
//
//
//
getPattern() {
        throw new Error(`Child classes should implement ${Pattern.name}:getPattern.`);
    }

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
        throw new Error("Child classes should implement ResourceUsage:error");
    }

    /**
     * Serialize the pattern data.
     * @returns {Object}
     */
    serialize() {
        throw new Error(`${ResourceUsage.name}:serialize must be implemented by child classes.`);
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
        throw new Error(`${ResourceUsage.name} is an abstract class and can not be instantiated.`);
    }
}
