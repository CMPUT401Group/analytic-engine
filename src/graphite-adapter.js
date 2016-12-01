import moment from 'moment';
import fs from 'fs';

import MetricsAPIAdapter from './metrics-api-adapter';
import RenderAPIAdapter from './render-api-adapter';

/**
 * @class GraphiteAdapter
 * @brief A interface to the graphite HTTP API.
 */
export default class GraphiteAdapter {
    constructor(graphiteURL) {
        this.graphiteURL = graphiteURL;
        this.metrics = new MetricsAPIAdapter(this.graphiteURL);
        this.render = new RenderAPIAdapter(graphiteURL);
    }

    /**
     * Generates all the metrics to a file.
     * @param destFile Destination file where results are saved.
     * @param logProgress
     */
    renderAllMetrics(timeBegin, timeEnd, destFile, logProgress = true) {
        var timeBeginUTC = moment(timeBegin).utc().format('HH:mm_YYYYMMDD');
        var timeEndUTC = moment(timeEnd).utc().format('HH:mm_YYYYMMDD');

        let allMetricsMetadata = this.metrics.findAll();
        let maxPathCount = this._maxPathCount(allMetricsMetadata);

        let targets = this._buildGLOBTargets(maxPathCount);

        fs.writeFileSync(destFile, '[');
        targets.forEach((metric, i) => {
            let renderRes = this.render.render({
                target: metric,
                format: 'json',
                from: timeBeginUTC,
                until: timeEndUTC,
            });

            const targetPattern = /summarize\(\s*([^,]+)\s*,\s*"10min"\s*,\s*"avg"\s*\)/;
            let normalizedTargetName  = renderRes.map(r => {
                let captureGroup1 = targetPattern.exec(r.target)[1];
                r.target = captureGroup1;
                return r;
            });
            let stringRenderRes = normalizedTargetName.map(r => JSON.stringify(r));
            fs.appendFileSync(destFile, stringRenderRes.join(","));

            let isLast = i == targets.length - 1;
            if (!isLast && renderRes.length) {
                fs.appendFileSync(destFile, ",");
            }

            if (logProgress) {
                console.log(`GraphiteAdapter.renderAllMetrics: ${i + 1} in ${targets.length}`);
            }
        });
        fs.appendFileSync(destFile, ']');
    }

    /**
     * @param allMetricsMetadata (result of calling MetricsAPIAdapter.findAll).
     * @returns {Number} Maximum number of path. (Max number of dots in a query).
     * @private
     */
    _maxPathCount(allMetricsMetadata) {
        let maxPathCount = allMetricsMetadata.reduce((lastValue, metric) => {
            let currentPathCount = metric.split('.').length;
            if (lastValue < currentPathCount) {
                return currentPathCount;
            }
            return lastValue;
        }, allMetricsMetadata[0].split('.').length);

        return maxPathCount;
    }

    /**
     * Builds the target to be rendered in a glob format (**).
     * @param maxPathCount Acquired from this._maxPathCount.
     * @returns {Array} List of glob targets.
     * @private
     */
    _buildGLOBTargets(maxPathCount) {
        let targets = [];
        for (let pathCount = 1; pathCount <= maxPathCount; pathCount++) {
            let currentQuery = [];
            for (let q = 0; q < pathCount; q++) {
                currentQuery.push("*");
            }
            let currentQueryStr = currentQuery.join(".");
            targets.push(`summarize(${currentQueryStr},"10min","avg")`);
        }

        return targets;
    }
}