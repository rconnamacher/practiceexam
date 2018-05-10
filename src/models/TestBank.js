
import {Model} from "../lib/models/Model.js";
import {field, collection, properties} from "../lib/models/definitions.js";
import {Question} from "./Question.js";

export class TestBank extends Model {
    /**
     * @param {Object=} data
     */
    constructor(data) {
        super(data);

        /** @type {!Array<!Question>} */          this.questions;
    }
}

properties(TestBank,
    /** @lends {TestBank.prototype} */ {
        questions:          ["questions",       collection(Question)],
    }
);
