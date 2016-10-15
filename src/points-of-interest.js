import _ from 'underscore';
import Mongo from 'mongodb';
import Fiber from 'fibers';
import assert from 'assert';

let MongoClient = Mongo.MongoClient;

/**
 * @class POI
 * @brief Points-Of-Interest module.
 *
 * Module for keeping track of Points-Of-Interests.
 */
export default class POI {
    /**
     *
     * @param {Number} dbPort Port of the mongo db instance.
     * @param {String} dbName Name of the database for this module. Created if not existed.
     */
    constructor(dbPort, dbName) {
        this.dbPort = dbPort;
        this.dbName = dbName;
        this.dbURL = `mongodb://localhost:${this.dbPort}/${this.dbName}`;

        this.db = null;
        this.poiCollection = null;
    }

    /**
     * Open connection db.
     */
    open() {
        let fiber = Fiber.current;
        MongoClient.connect(this.dbURL, (err, db) => {
            assert.equal(null, err);
            console.log("Connected correctly to server.");
            this.db = db;
            this.poiCollection = db.collection('poi');

            fiber.run();
        });
        Fiber.yield();
    }

    /**
     * Close connection to db if open. If close, nothing is done.
     */
    close() {
        if (_.isObject(this.db)) {
            this.db.close();
            console.log("Disconnected correctly from server.");
            this.db = null;
            this.poiCollection = null;
        }
    }

    /**
     * Drop all the patterns or points of interest. Must not be used
     * lightly. Must be used for testing.
     */
    removeAll() {
        let fiber = Fiber.current;
        this.poiCollection.drop((err, result) => {
            assert.equal(null, err);
            console.log("POI dropped.");
            fiber.run();
        });
        Fiber.yield();
    }

    /**
     * @param [
     *          {
     *            target: String,
     *            datapoints: [[Number, Number], ...]
     *          }, ...
     *        ] datas Grafana json format for metrics.
     */
    insert(datas) {
        let fiber = Fiber.current;

        // mongo.collection.insertMany modify "datas", which
        // might cause unexpected changes. The parameter "datas"
        // must not be modified.
        let clonedDatas = _.map(datas, _.clone);

        this.poiCollection.insertMany(clonedDatas, (err, result) => {
            assert.equal(null, err);
            assert.equal(clonedDatas.length, result.result.n);
            assert.equal(clonedDatas.length, result.ops.length);
            console.log("POI inserted.");

            fiber.run();
        });
        Fiber.yield();
    }

    /**
     * @returns {Array} All the points of interest.
     */
    findAll() {
        let fiber = Fiber.current;
        let dataSets = [];
        this.poiCollection.find({}).toArray((err, docs) => {
            dataSets = docs;
            fiber.run();
        });
        Fiber.yield();
        return dataSets;
    }
}