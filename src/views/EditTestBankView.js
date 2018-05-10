import {Question} from "../models/Question.js";
import {View} from "./View.js";
import {unique, lastUnique} from "../util/number.js";
import {EditQuestionView} from "./EditQuestionView.js";
import {ImportQuestionsModal} from "./ImportQuestionsModal.js";
import {ExportQuestionsModal} from "./ExportQuestionsModal.js";
import {TestBank} from "../models/TestBank.js";
import {edittest} from "localized/edittest.js";


export class EditTestBankView extends View {
    constructor(model) {
        super("section", "page edit-test-bank responsive-toolbar");

        /** @type {!TestBank} */
        this.model = model;

        /** @type {!number} */
        this.numQuestions = 0;

        /** @type {!string} */
        this.title = edittest.title;
    }

    render() {
        return `
            <header class="toolbar">
                <h2>${edittest.title}</h2>
                <div class="actions">
                    <a class="action add-action" href="#edit/new" title="${edittest.new_button}" data-short-title="${edittest.new_button_short}"></a>
                    <a class="action save-action disabled" download="Questions.json" title="${edittest.save_button}" data-short-title="${edittest.save_button_short}"></a>
                    <a class="action load-action" title="${edittest.load_button}" data-short-title="${edittest.load_button_short}"></a>
                    <a class="action" href="#" title="${edittest.done_button}"></a>
                </div>
            </header>
            <main>
                <table class="edit-questions">
                    <thead>
                        <th class="number"></th>
                        <th class="question">${edittest.question_header}</th>
                        <th class="answer">${edittest.answer_header}</th>
                        <th class="incorrect-answers">${edittest.incorrect_header}</th>
                        <th class="notes">${edittest.notes_header}</th>
                    </thead>
                    <tbody></tbody>
                </table>
            </main>
        `;
    }

    didRefresh() {
        this.removeObservers();
        this.numQuestions = 0;

        const addButton = this.requireSelector(".actions a.add-action");
        const questionsTable = this.requireSelector("table.edit-questions > tbody");
        const saveButton = this.requireSelector(".actions a.save-action");
        const loadButton = this.requireSelector(".actions a.load-action");
        const model = this.model;

        for (let questionModel of model.questions) {
            const questionView = new EditTestBankQuestionRow(questionModel, this.numQuestions++);
            this.displaySubview(questionView, questionsTable);
        }

        // Generate download button
        const saveData = JSON.stringify(model.exportFields(), null, 2);
        saveButton.classList.toggle("disabled", !model.questions.length);

        saveButton.addEventListener("click", this.saveButtonClicked.bind(this));
        loadButton.addEventListener("click", this.loadButtonClicked.bind(this));

        model.observe("questions", this, () => {
            this.refresh();
        });
    }

    didRemove() {
        this.removeObservers();
    }

    removeObservers() {
        const model = this.model;

        model.unobserve("questions", this);
    }

    saveButtonClicked() {
        const modal = new ExportQuestionsModal(this.model);
        this.displaySubview(modal);
        modal.onclose = () => {
            this.removeSubview(modal);
        }
    }

    loadButtonClicked() {
        const modal = new ImportQuestionsModal(this.model);
        this.displaySubview(modal);
        modal.onclose = () => {
            this.removeSubview(modal);
        }
    }
}


export class EditTestBankQuestionRow extends View {
    constructor(/** !Question */ model, /** !number */ index) {
        super("tr", "question");
        this.model = model;
        this.index = index;

        this._bindings = [];
    }

    render() {
        const model = this.model;
        const indexPlusOne = this.index+1;

        return `
            <th class="number">${indexPlusOne}</th>
            <td class="question"></td>
            <td class="answer" title="${edittest.answer_header_inline}"></td>
            <td class="incorrect-answers" title="${edittest.incorrect_header_inline}"></td>
            <td class="notes" title="${edittest.notes_header_inline}"></td>
        `;
    }

    didRefresh() {
        const model = this.model;
        this.removeObservers();

        this.domElement.addEventListener("click", () => {
            location.hash = `#edit/${this.index+1}`;
        })

        const questionCell = this.requireSelector("td.question");
        const answerCell = this.requireSelector("td.answer");
        const incorrectAnswersCell = this.requireSelector("td.incorrect-answers");
        const notesCell = this.requireSelector("td.notes");

        const updateQuestion = value => {
            questionCell.textContent = value;
        };
        const updateAnswer = value => {
            answerCell.textContent = value;
        };
        const updateNotes = value => {
            notesCell.textContent = value;
        }
        const updateIncorrect = value => {
            incorrectAnswersCell.innerHTML = "";
            for (let i = 0, l = value.length; i < l; i++) {
                const answer = value[i];
                const div = document.createElement("div");
                div.textContent = answer;
                if (i < l-1) {
                    div.textContent += ",";
                }
                incorrectAnswersCell.appendChild(div);
            }
        }

        updateQuestion(model.question);
        updateAnswer(model.answer);
        updateIncorrect(model.incorrectAnswers);
        updateNotes(model.notes);

        model.observe("question", this, updateQuestion);
        model.observe("answer", this, updateAnswer);
        model.observe("incorrectAnswers", this, updateIncorrect);
        model.observe("notes", this, updateNotes);
    }

    didRemove() {
        this.removeObservers();
    }

    removeObservers() {
        const model = this.model;

        model.unobserve("question", this);
        model.unobserve("answer", this);
        model.unobserve("incorrectAnswers", this);
    }

}