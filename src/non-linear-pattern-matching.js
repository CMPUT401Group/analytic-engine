const className = NonLinearPatternMatching;

export default class NonLinearPatternMatching {
    constructor() {
    }

    error(realDataSets, patternDataSets) {
        if (!(realDataSets instanceof Array)){
            throw `${className}.error parameter realData is not an Array.`;
        }

        if (!(patternDataSets instanceof Array)) {
            throw `${className}.error parameter patternData is not an Array.`;
        }

        if (realDataSets.length !== patternDataSets.length) {
            throw `${className}.error parameters have different number of data sets.`;
        }

        let dataSetsIsEmpty = realDataSets.length === 0;
        if (dataSetsIsEmpty) {
            throw `${className}.error parameters have empty data sets.`;
        }

        // Now that we know there is at least one data set. Check that each data set have all equal cardinality.
        // TODO: Deal with the case in which the patternDataSets is filtered. That is it went on some smoothing and have
        //       less data points.
        let expectedDataSetCardinality = realDataSets[0].length;
        for (let realDataSet of realDataSets) {
            if (expectedDataSetCardinality !== realDataSet.length) {
                throw `Check ${className}.error data set. Cardinality must be equal for all data sets.`;
            }
        }
        for (let patternDataSet of patternDataSets) {
            if (expectedDataSetCardinality !== patternDataSet.length) {
                throw `Check ${className}.error data set. Cardinality must be equal for all data sets.`;
            }
        }

        let dataSetsErrors = realDataSets.map((realDataSet, realDataSetIndex) => {
            let patternDataSet = patternDataSets[realDataSetIndex];
            return realDataSet.map((realData, realDataIndex) => {
                let patternData = patternDataSet[realDataIndex];
                return Math.abs(realData - patternData);  // TODO: Is this always the case? Should abs be a flag.
            });
        });

        let dataSetsErrorSum = dataSetsErrors.map(
            dataSetsError => dataSetsError.reduce(
                (errorSum, dataSetError) => (errorSum + dataSetError), 0.0)
        );

        let errorSum = dataSetsErrorSum.reduce((errorSum, dataSetsError) => (errorSum + dataSetsError), 0.0);
        let error = errorSum/(2 * expectedDataSetCardinality);
        return error;
    }
}