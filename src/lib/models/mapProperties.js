

/**
 *
 * @param {Function} constructor
 * @param {*} modelPropertyMap
 */
export function mapProperties(constructor, modelPropertyMap) {
    function _propertyDefinition(modelProperty, property, fieldName) {
        return {
            /** @this {Object} */
            'get': function() {
                const model = this[modelProperty];
                if (model !== undefined) {
                    return this[modelProperty].get(fieldName);
                } else {
                    console.error(`Model is undefined: ${modelProperty}`);
                }
            },
            /** @this {Object} */
            'set': function(value) {
                const model = this[modelProperty];
                if (model !== undefined) {
                    return this[modelProperty].set(fieldName, value);
                } else {
                    throw new Error(`Model ${modelProperty} is undefined`);
                }
            }
        }
    }
    const definitions = {};
    for (let modelProperty in modelPropertyMap) {
        const propertyMap = modelPropertyMap[modelProperty];
        for (let property in propertyMap) {
            definitions[property] = _propertyDefinition(modelProperty, property, propertyMap[property]);
        }
    }

    Object.defineProperties(constructor.prototype, definitions);
}