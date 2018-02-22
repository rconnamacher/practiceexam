
/**
 * Serializable objects (like models). Any object whose value can be exported into json
 * and read back.
 * @interface
 */
export class Serializable {
    /** @param {Array|Object|number|string} serialized */
    constructor(serialized) {

    }

/** @return {Array|Object|number|string} */
exportFields() { }

};
