
import {assert} from "./modelUtils.js";
import {DataType} from "./modelTypes.js";


const FIELD_CONSTRAINTS = {
    min: function(constraint, value, fieldName) {
        assert(fieldName, `value ${value} isn't over ${constraint}`, value >= constraint);
    },
    max: function(constraint, value, fieldName) {
        assert(fieldName, `value ${value} isn't under ${constraint}`, value <= constraint);
    },
    int: function(constraint, value, fieldName) {
        assert(fieldName, `value ${value} isn't an integer`, !constraint || value % 1 == 0);
    },
    choices: function(constraint, value, fieldName) {
        assert(fieldName, `value ${value} isn't in ${constraint}`, constraint.indexOf(value) !== -1);
    },
    nullable: function(constraint, value, fieldName) {
        if (constraint == false) {
            assert(fieldName, "value can't be null or undefined", value !== null && value !== undefined);
        }
    }
}


export class FieldDefinition {
    /**
     * @param {!DataType} type
     * @param {Object=} constraints
     */
    constructor(type, constraints) {
        var typeOfType = typeof type;
        assert("type", "Type is not a valid type: "+typeOfType,
                        typeOfType == "string" || typeOfType == "function")
        this.type = type;
        this.constraints = constraints || {};
    }


    /**
     * @param {?} value
     * @param {string} fieldName
     * @param {string|number=} key
     */
    validate(value, fieldName, key) {
        this._validateOne(value, fieldName);
    }


    /**
     * @param {?} value
     * @param {string} fieldName
     */
    _validateOne(value, fieldName) {
        if (value === undefined) {
            debugger;
        }
        var type            = this.type,
            typeOfType      = typeof type,
            constraints     = this.constraints;

        switch (typeOfType) {
            case "string":
                assert(
                    fieldName,
                    "Value is not a " + type,
                    typeof value === /** @type {string} */ (type)
                );
                break;
            case "function":
                assert(
                    fieldName,
                    "Value is not a " + type.name,
                    value === null || value instanceof /** @type {function(new:?)} */ (type)
                );
                break;
            default:
                throw new Error("Unsupported type of type: "+typeOfType);
        }

        for (var constraint in constraints) {
            if (constraint in FIELD_CONSTRAINTS) {
                FIELD_CONSTRAINTS[constraint](constraints[constraint], value, fieldName)
            }
        }
    }

    /**
     * @param {?} value
     * @return {?}
     */
    exportValue(value) {
        if (typeof this.type == "function") {
            return value ? value.exportFields() : null;
        } else {
            return value;
        }
    }


    /**
     * @param {?} value
     * @param {string} fieldName
     * @return {?}
     */
    parse(value, fieldName) {
        var type = this.type;
        var typeOfType = typeof type;
        switch (typeOfType) {
            case "string":
                this._validateOne(value, fieldName);
                return value;
            case "function":
                // 'fromJSON' must be quoted where defined to prevent Closure Compiler from flattening it.
                // Flattened static methods can't be used dynamically like this.
                if (!value) {
                    return null;
                } else if (type['fromJSON']) {
                    return type['fromJSON'](value);
                } else {
                    return new /** @type {function(new:Object, ...?)} */ (type)(value);
                }
            default:
                throw new Error("Unknown value type: "+typeOfType)
        }
    }


    /** @return ? */
    init() {
        var type = this.type,
            constraints = this.constraints;
        if (goog.isDef(constraints.default)) {
            return constraints.default;
        } else if (constraints.choices) {
            return constraints.choices[0];
        }
        if (typeof type == "string") {
            var defaults = {
                "number": 0,
                "string": "",
                "boolean": false
            }

            if ( !(type in defaults) )
                throw new Error("Unknown type: "+type);

            return defaults[type];

        } else {
            return new /** @type {function(new:Object, ...?)} */ (type)();
        }
    }
}
