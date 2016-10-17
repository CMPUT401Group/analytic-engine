import config from 'config';

import {Threshold, THRESHOLDRULE, PatternFactory} from '../../src/patterns';
import POI from './../../src/points-of-interest';

let mongodPort = config.get('mongodPort');

// TODO: Make an integration or acceptance testing folder. This test
//       is more like an acceptance testing.

describe("AnalyticEngine - POI", function() {
    beforeEach(function() {
        this.poi = new POI(mongodPort, 'app-test');
        this.poi.open();
    });

    afterEach(function() {
        this.poi.removeAll();
        this.poi.close();
    });

    it('insert', function() {
        let expectedThresholdPattern = new Threshold([
            {
                target: 'dummy.metric.1',
                thresholdRule: THRESHOLDRULE.EQUAL,
                value: 5
            }
        ]);

        this.poi.insert([expectedThresholdPattern]);

        let thresholdPatterns = this.poi.findAll();

        expect(thresholdPatterns[0]).toEqual(expectedThresholdPattern);
    });
});