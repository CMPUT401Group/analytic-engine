import MetricsAPIAdapter from './metrics-api-adapter';
import RenderAPIAdapter from './render-api-adapter';

/**
 * @class GraphiteAdapter
 * @brief A interface to the graphite HTTP API.
 */
class GraphiteAdapter {
    constructor(graphiteURL) {
        this.graphiteURL = graphiteURL;
        this.metrics = new MetricsAPIAdapter(this.graphiteURL);
        this.render = new RenderAPIAdapter(graphiteURL);
    }
}

let graphiteAdapterInstance = new GraphiteAdapter();
export default graphiteAdapterInstance;