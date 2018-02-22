
import ValidationError from "./ValidationError.js";

/**
 * @param {string} fieldName
 * @param {string} message
 * @param {boolean} condition
 */
export function assert(fieldName, message, condition) {
    if (!condition) {
        throw new ValidationError(fieldName+": "+message);
    }
}
