import _ from 'underscore';
import Mongo from 'mongodb';
import Fiber from 'fibers';
import assert from 'assert';
import log from 'loglevel';

import {Pattern, PatternFactory} from './patterns';

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
            log.info("Connected correctly to server.");
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
            log.info("Disconnected correctly from server.");
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
            log.info("POI dropped.");
            fiber.run();
        });
        Fiber.yield();
    }

    /**
     * Inserts pattern.
     *
     * @param {Array<Object.<pattern>>} patterns Array of patterns.
     */
    insert(patterns) {
        assert(_.isArray(patterns), `${POI.name}:insert should be given an Array of ${Pattern.name}.`);
        assert(patterns.length, `${POI.name}:insert should be given a non-empty Array of ${Pattern.name}.`);
        assert(patterns[0] instanceof Pattern, `${POI.name}:insert should be given a non-empty Array of ${Pattern.name}.`);

        let fiber = Fiber.current;

        let serializedPatterns = patterns.map(pattern => pattern.serialize());

        this.poiCollection.insertMany(serializedPatterns, (err, result) => {
            assert.equal(null, err);
            assert.equal(serializedPatterns.length, result.result.n);
            assert.equal(serializedPatterns.length, result.ops.length);

            log.info("POI inserted.");

            fiber.run();
        });
        Fiber.yield();
    }

    insertAsync(patterns) {
        assert(_.isArray(patterns), `${POI.name}:insert should be given an Array of ${Pattern.name}.`);
        assert(patterns.length, `${POI.name}:insert should be given a non-empty Array of ${Pattern.name}.`);
        assert(patterns[0] instanceof Pattern, `${POI.name}:insert should be given a non-empty Array of ${Pattern.name}.`);

        let serializedPatterns = patterns.map(pattern => pattern.serialize());

        return new Promise((resolve, reject) => {
            this.poiCollection.insertMany(serializedPatterns, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Gets all points of interest.
     *
     * @returns {Array<Object.<pattern>>} Array of patterns.
     */
    findAll() {
        let fiber = Fiber.current;
        let serializedPatterns = [];
        this.poiCollection.find({}).toArray((err, docs) => {
            serializedPatterns = docs;
            fiber.run();
        });
        Fiber.yield();

        let patterns = serializedPatterns.map(serializedPattern => PatternFactory.deserialize(serializedPattern));
        return patterns;
    }

    /**
     * Gets all Threshold points of interest.
     */
    findAllThreshold() {
        let fiber = Fiber.current;
        let serializedPatterns = [];
        this.poiCollection.find({name: 'Threshold'}).toArray((err, docs) => {
            serializedPatterns = docs;
            fiber.run();
        });
        Fiber.yield();

        let patterns = serializedPatterns.map(serializedPattern => PatternFactory.deserialize(serializedPattern));
        return patterns;
    }

    /**
     * Gets all Threshold points of interest.
     */
    findAllThresholdAsync(serialize=false) {
        return new Promise((resolve, reject) => {
            this.poiCollection.find({ _type: "Threshold" }).toArray((err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    if (serialize) {
                        docs = docs.map(serializedPattern => PatternFactory.deserialize(serializedPattern));
                    }
                    resolve(docs);
                }
            });
        });
    }
}