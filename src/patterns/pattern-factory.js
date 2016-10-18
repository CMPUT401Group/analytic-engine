import assert from 'assert';
import _ from 'underscore';

import Pattern from './pattern';
import {Threshold} from './threshold';

export default class PatternFactory {
    /**
     * Convert a given a serialized pattern object from  db, create a Pattern instance of it.
     * @param {Object} serializedPattern Object, probably from db that needs to be
     *                                   converted to a proper Pattern instance.
     * @returns {Pattern} A non-abstract child of Pattern class.
     * @exception Thrown if the deserialization error occur or invalid type.
     */
    static deserialize(serializedPattern) {
        let type = serializedPattern._type;

        assert(_.isString(type), 'Error de-serializing pattern. "type" is undefined.');

        delete serializedPattern._type;

        switch(type) {
            case Pattern.name:
                return Pattern.deserialize(serializedPattern);
            case Threshold.name:
                return Threshold.deserialize(serializedPattern);
            default:
                throw new Error(`Pattern type:"${type}" is either not implemented or invalid.`);
        }
    }
}