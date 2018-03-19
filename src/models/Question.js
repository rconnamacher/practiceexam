
import {Model} from "../lib/models/Model.js";
import {field, collection, properties} from "../lib/models/definitions.js";

export class Question extends Model {
    /**
     * @param {Object=} data
     */
    constructor(data) {
        super(data);

        /** @type {!string} */          this.question;
        /** @type {!string} */          this.answer;
        /** @type {!Array.<!string>} */ this.incorrectAnswers;
        /** @type {!string} */          this.notes;
    }
}

properties(Question,
    /** @lends {Question.prototype} */ {
        question:           ["question",            field("string")],
        answer:             ["answer",              field("string")],
        incorrectAnswers:   ["incorrectAnswers",    collection("string")],
        notes:              ["notes",               field("string")],
    }
);
