
import {FieldDefinition} from "./FieldDefinition.js";
import {assert} from "./modelUtils.js";

const COLLECTION_CONSTRAINTS = {
    mincount: function(constraint, value, fieldName) {
        var length = value.length;
        assert(fieldName, "Array length "+length+" is under "+constraint, length >= constraint)
    },
    maxcount: function(constraint, value, fieldName) {
        var length = value.length;
        assert(fieldName, "Array length "+length+" is over "+constraint, length <= constraint)
    },
    /** @this {?} */
    count: function(constraint, value, fieldName) {
        // Test this in Advanced Optimizations
        this.mincount(constraint,value,fieldName);
        this.maxcount(constraint,value,fieldName);
    }
};

export class CollectionDefinition extends FieldDefinition {


    constructor(type, constraints) {
        if (!constraints) {
            constraints = [];
        }
        if (!constraints.default) {
            constraints.default = [];
        }

        super(type, constraints);
    }


    /**
     * @override
     */
    validate(value, fieldName, key) {
        if (goog.isDef(key)) {
            assert(fieldName, "Key must be an integer", typeof key == "number" && key % 1 === 0);
            super.validate(value, fieldName+"["+key+"]");
        } else {
            assert(fieldName, "Value must be an array", value instanceof Array);

            var constraints = this.constraints;
            for (var constraint in constraints) {
                if (constraint in COLLECTION_CONSTRAINTS) {
                    COLLECTION_CONSTRAINTS[constraint](constraints[constraint], value, fieldName)
                }
            }

            for (var i=0, length=value.length; i<length; i++) {
                super.validate(value[i], fieldName+"["+i+"]");
            }
        }
    }


    /**
     * @override
     */
    exportValue(value) {
        var output = [];
        for (var i=0,l=value.length; i<l; i++) {
            output[i] = super.exportValue(value[i]);
        }
        return output;
    }


    /**
     * @override
     */
    parse(value, fieldName) {
        var parseData = [];
        assert(fieldName, "value is not an array", value instanceof Array);
        for (var i=0,l=value.length; i<l; i++) {
            parseData[i] = super.parse(value[i], fieldName);
        }
        return parseData;
    }

}
