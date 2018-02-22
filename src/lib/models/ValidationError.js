

/**
 * @class
 * This will work better with true ES6 output, when available.
 */
export default class ValidationError extends Error {
    /** @param {string} message */
    constructor(message) {
        super(message);

        this.name = "ValidationError";
        this.message = message;

        // Following line may not be necessary with true ES6 compilation output
        if (!this.stack) {
            this.stack = new Error(message).stack;
        }
    }
}