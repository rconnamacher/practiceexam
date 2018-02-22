
import {FieldDefinition} from "./FieldDefinition.js";
import {assert} from "./modelUtils.js";


export class MapDefinition extends FieldDefinition {

    constructor(type, constraints) {
        if (!constraints.default) {
            constraints.default = {};
        }
        super(type, constraints);
    }


    /**
     * @override
     */
    validate(value, fieldName, key) {
        if (key) {
            assert(fieldName, "Key must be a string or number", typeof key == "string" || isFinite(key));
            super.validate(value, fieldName+"["+key+"]");
        } else {
            for (let aKey in value) {
                super.validate(value[aKey], fieldName+"["+aKey+"]")
            }
        }
    }


    /**
     * @override
     */
    parse(value, fieldName) {
        assert(fieldName, "value is not an object", value instanceof Object);
        var parseData = {};
        for (var key in value) {
            parseData[key] = super.parse(value[key], fieldName);
        }
        return parseData;
    }


    /**
     * @override
     */
    exportValue(value) {
        var output = {};
        for (var key in value) {
            output[key] = super.exportValue(value[key]);
        }
        return output;
    }

}
