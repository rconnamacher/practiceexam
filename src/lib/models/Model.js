
import {Serializable} from "./Serializable.js";

/** @const {!symbol} */
export const FIELDS_PROPERTY = Symbol("fields");

/**
 * @typedef {function(*, string, Model)}
 */
let ChangeHandler;

/**
 * Root class for model objects. Store evesrything involving savable game state here.
 * @implements {Serializable}
 */
export class Model {
    constructor(/** Object= */ saveData) {
        /** @private */
        this.fields = {};

        /** @private */
        this._observers = {};

        this.init();
        if (saveData) {
            this.load(saveData);
        }
    }


    /**
     * @param {string} field
     * @param {string=} key Optional
     * @param {*=} defaultValue Optional
     * @return {*}
     */
    get(field, key, defaultValue) {
        var value = this.fields[field];
        if (goog.isDef(key)) {
            if (value)
                value = key in value ? value[key] : defaultValue
            else
                value = undefined;
        }
        return value;
    }


    /**
     * @param {!string} field
     * @param {*} value
     * @param {string|number=} key (optional)
     */
    set(field, value, key) {
        var definition = this.constructor[FIELDS_PROPERTY][field];
        if (!definition) {
            throw new Error("Unknown field "+field);
        }

        definition.validate(value, field, key);

        if (goog.isDef(key)) {
            this.fields[field][key] = value;
        } else {
            this.fields[field] = value;
        }

        this.fieldChanged(field, value);

        return value;
    }

    /**
     * Append value to field, assuming field is a collection
     * @param {!string} field
     * @param {*} value
     */
    append(field, value) {
        this.set(field, value, this.fields[field].length);
    }

    /**
     * @param {!string} field
     * @param {*} value
     */
    fieldChanged(field, value) {
        const observers = this._observers[field];
        for (var i=0,l=observers.length; i<l; i++) {
            const record = observers[i];
            record[1].call(record[0], value, field, this);
        }
    }

    _getFieldObservers(field) {
        const observers = this._observers[field];
        if (!observers) {
            throw new Error("Unknown field: " + field);
        }
        return observers;
    }

    /**
     * @param {!string} field
     * @param {?Object} observer
     * @param {ChangeHandler=} handler
     */
    observe(field, observer, handler) {
        const observers = this._getFieldObservers(field);
        observers.push([observer, handler]);
    }

    /**
     * @param {!string} field
     * @param {?Object} observer
     * @param {ChangeHandler=} handler
     */
    unobserve(field, observer, handler) {
        const observers = this._getFieldObservers(field);
        this._observers[field] = observers.filter(record =>
            !(record[0] === observer && (!handler || record[1] == handler))
        );
    }

    init() {
        var definitions = this.constructor[FIELDS_PROPERTY];
        for (var fieldName in definitions) {
            var definition = definitions[fieldName];
            this._observers[fieldName] = [];
            this.set(fieldName, definition.init());
        }
    }


    load(data) {
        for (var fieldName in data) {
            var definition = this.constructor[FIELDS_PROPERTY][fieldName];
            if (!definition) {
                console.error("Unknown field: ",this.constructor.name,fieldName);
            } else {
                try {
                    this.set(fieldName, definition.parse(data[fieldName], fieldName))
                } catch (error) {
                    console.error(`Error loading field ${fieldName}: ${error}`);
                    throw error;
                }
            }

        }
    }


    exportFields() {
        var fields = this.fields;
        var definitions = this.constructor[FIELDS_PROPERTY];
        var saveData = {};
        var saveValue;

        for (var fieldName in fields) {
            saveData[fieldName] = definitions[fieldName].exportValue(fields[fieldName]);
        }
        return saveData;
    }
}
