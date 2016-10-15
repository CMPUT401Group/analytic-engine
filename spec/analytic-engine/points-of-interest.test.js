import config from 'config';

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
    });

    it('insert', function() {
        let dummyDataSetsFromGraphite = [
            {
                target:'data-set-1',
                datapoints: [[1, 0], [2, 1]]
            },
            {
                target:'data-set-2',
                datapoints: [[2, 0], [3, 1]]
            }
        ];

        this.poi.insert(dummyDataSetsFromGraphite);

        // Remove _id field.
        let allPOI = this.poi.findAll().map(poi => {
            return { target: poi.target, datapoints: poi.datapoints }
        });

        expect(allPOI).toEqual(dummyDataSetsFromGraphite);
    });
});