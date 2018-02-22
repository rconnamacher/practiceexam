
import {Question} from "../models/Question.js";
import {View} from "./View.js";
import {unique, lastUnique} from "../util/number.js";

function _truncateString(string, maxLength) {
    if (string.length > maxLength) {
        string = string.substr(maxLength-3 + "…");
    }
    return string;
}

export class EditQuestionView extends View {
    constructor(/** !Question */ model) {
        super("section", "page edit-question");

        this.model = model;

        this.title = "Edit Question: " + _truncateString(model.question, 20);
        this.numIncorrectAnswers = 0;

        /** @type {Element} */
        this.incorrectAnswerElement

        /** @type {?function()} */
        this.onsave = null;
    }

    render() {
        return `
            <header>
                <h2>Edit Question</h2>
            </header>
            <main>
                <div class="field textarea question">
                    <label for="question-${unique()}">Question:</label>
                    <textarea id="question-${lastUnique()}"></textarea>
                </div>
                <div class="field text correct-answer">
                    <label for="answer-${unique()}">Correct Answer:</label>
                    <input id="answer-${lastUnique()}" type="text">
                </div>
                <div class="incorrect-answers"></div>
                <div class="actions"><a class="button save">Done</a></div>
            </main>
        `;
    }

    didRefresh() {
        const model = this.model;
        const questionInput = this.querySelector(".question textarea");
        const answerInput = this.querySelector(".correct-answer input");
        const saveButton = this.querySelector(".button.save");

        // Clean up model (if needed)
        model.incorrectAnswers = model.incorrectAnswers.filter(Boolean);

        // Bind input values

        questionInput.value = model.question || "";
        answerInput.value = model.answer || "";

        questionInput.addEventListener("input", () => {
            model.question = questionInput.value;
        });
        answerInput.addEventListener("input", () => {
            model.answer = answerInput.value;
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
            <label for="answer-${unique()}">Incorrect Answer:</label>
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