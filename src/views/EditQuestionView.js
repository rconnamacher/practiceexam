
import {Question} from "../models/Question.js";
import {View} from "./View.js";
import {unique, lastUnique} from "../util/number.js";
import {edittest} from "localized/edittest.js";

function _truncateString(string, maxLength) {
    if (string.length > maxLength) {
        string = string.substr(maxLength-3) + "…";
    }
    return string;
}

export class EditQuestionView extends View {
    constructor(/** !Question */ model) {
        super("section", "page edit-question");

        /** @type {!Question} */
        this.model = model;

        this.title = edittest.edit_question_title(_truncateString(model.question, 20));
        this.numIncorrectAnswers = 0;

        /** @type {Element} */
        this.incorrectAnswerElement

        /** @type {?function()} */
        this.onsave = null;
    }

    render() {
        return `
            <header>
                <h2>${edittest.edit_question_header}</h2>
            </header>
            <main>
                <div class="field textarea question">
                    <label for="question-${unique()}">${edittest.question_header_inline}</label>
                    <textarea id="question-${lastUnique()}"></textarea>
                </div>
                <div class="field text correct-answer">
                    <label for="answer-${unique()}">${edittest.answer_header_inline}</label>
                    <input id="answer-${lastUnique()}" type="text">
                </div>
                <div class="incorrect-answers"></div>
                <div class="field textarea notes">
                    <label for="notes-${unique()}">${edittest.notes_header_inline}</label>
                    <textarea id="notes-${lastUnique()}"></textarea>
                </div>
                <div class="actions"><a class="button save">${edittest.done_button}</a></div>
        </main>
        `;
    }

    didRefresh() {
        const model = this.model;
        const questionInput = this.requireSelector(".question textarea");
        const answerInput = this.requireSelector(".correct-answer input");
        const saveButton = this.requireSelector(".button.save");
        const notesInput = this.requireSelector(".notes textarea");

        // Clean up model (if needed)
        model.incorrectAnswers = model.incorrectAnswers.filter(Boolean);

        // Bind input values

        questionInput.value = model.question || "";
        answerInput.value = model.answer || "";
        notesInput.value = model.notes || "";

        questionInput.addEventListener("input", () => {
            model.question = questionInput.value;
        });
        answerInput.addEventListener("input", () => {
            model.answer = answerInput.value;
        });
        notesInput.addEventListener("input", () => {
            model.notes = notesInput.value;
        });
        saveButton.addEventListener("click", () => {
            if (this.onsave) {
                this.onsave.call(null);
            }
        });


        // Render incorrect answer block and bind its values

        this.incorrectAnswerElement = this.domElement.querySelector(".incorrect-answers");
        this.numIncorrectAnswers = 0;

        for (let answer of model.incorrectAnswers) {
            this.addIncorrectAnswer(answer);
        }
        this.addIncorrectAnswer();
    }

    didRemove() {
        const model = this.model;

        // Filter out blank answers
        model.incorrectAnswers = model.incorrectAnswers.filter(Boolean);
    }

    addIncorrectAnswer(/** !string= */ answer="") {
        const model = this.model;

        const field = document.createElement("div");
        field.className = "field text incorrect-answer";
        field.innerHTML = `
            <label for="answer-${unique()}">${edittest.incorrect_one_header_inline}</label>
            <input id="answer-${lastUnique()}" type="text">
        `

        const answerIndex = this.numIncorrectAnswers++;
        const input = field.querySelector("input");
        if (answer) {
            input.value = answer;
        }
        input.addEventListener("input", () => {
            model.incorrectAnswers[answerIndex] = input.value;
            if (input.value
                && answerIndex == this.numIncorrectAnswers -1
                && !model.incorrectAnswers.some(value => !value)
            ) {
                // Add another blank answer to the end
                this.addIncorrectAnswer();
            }
        });

        this.incorrectAnswerElement.appendChild(field);
    }
}