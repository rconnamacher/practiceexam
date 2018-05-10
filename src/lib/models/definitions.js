


import {FieldDefinition} from "./FieldDefinition.js";
import {CollectionDefinition} from "./CollectionDefinition.js";
import {MapDefinition} from "./MapDefinition.js";
import {Model} from "./Model.js";
import {DataType, Constructor} from "./modelTypes.js";
import {FIELDS_PROPERTY} from "./Model.js";

/**
 * @param {Constructor} constructor
 * @param {Object<string,FieldDefinition>} fields
 */
function setFields(constructor, fields) {
    var schema = _createFieldsProperty(constructor);
    goog.mixin(schema, fields);
}

/**
 * @private
 * @param {Constructor} constructor
 * @return {Object}
 */
function _createFieldsProperty(constructor) {
    var schema;
    if (constructor.hasOwnProperty(FIELDS_PROPERTY)) {
        schema = constructor[FIELDS_PROPERTY];
    } else {
        var superPrototype = constructor.superClass_ || Object.getPrototypeOf(constructor.prototype),
            superConstructor = superPrototype.constructor;

        schema = Object.create(superConstructor[FIELDS_PROPERTY] || {});
        constructor[FIELDS_PROPERTY] = schema;
    }

    return schema;
}


/**
 * Be sure to provide a matching property declaration in your model's construtor,
 * and to add the (a)lends annotation to the 'properties' object provided here.
 *
 * @param {Constructor} constructor
 * @param {Object<string,Array<string|FieldDefinition>>} properties
 */
export function properties(constructor, properties) {
    if ( goog.DEBUG && !(constructor.prototype instanceof Model ) ) {
        throw new TypeError("Not a Model: " + constructor.name);
    }

    var fields = {},
        propertyDefinitions = {};

    /** @return {function(this:Model)} */
    function _get(fieldName) {
        return /** @this {Model} */ function get() {
            return this.get(fieldName);
        }
    }

    /** @return {function(this:Model, ?)} */
    function _set(fieldName) {
        return /** @this {Model} */ function set(value) {
            return this.set(fieldName, value);
        }
    }

    for (var propertyName in properties) {
        var record = properties[propertyName],
            fieldName = record[0],
            fieldDefinition = record[1];

        if (goog.DEBUG && !fieldName) {
            throw new TypeError("Field name is missing");
        }

        if (goog.DEBUG && !fieldDefinition) {
            throw new TypeError("Field definition is missing");
        }

        fields[fieldName] = fieldDefinition;

        propertyDefinitions[propertyName] = {
            enumerable: true,
            configurable: true,
            get: _get(fieldName),
            set: _set(fieldName),
        }
    }

    setFields(constructor, fields);
    Object.defineProperties(constructor.prototype, propertyDefinitions);
}


/**
 * @param {DataType} type
 * @param {Object=} constraints
 * @return {FieldDefinition}
 */
export function field(type, constraints) {
    return new FieldDefinition(type, constraints);
}


/**
 * @param {DataType} type
 * @param {Object=} constraints
 * @return {CollectionDefinition}
 */
export function collection(type, constraints) {
    return new CollectionDefinition(type, constraints);
}


/**
 * @param {DataType} type
 * @param {Object=} constraints
 * @return {MapDefinition}
 */
export function map(type, constraints) {
    return new MapDefinition(type, constraints);
}

