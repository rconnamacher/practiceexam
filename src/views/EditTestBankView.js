import {Question} from "../models/Question.js";
import {View} from "./View.js";
import {unique, lastUnique} from "../util/number.js";
import {EditQuestionView} from "./EditQuestionView.js";
import {ImportQuestionsModal} from "./ImportQuestionsModal.js";
import {ExportQuestionsModal} from "./ExportQuestionsModal.js";

export class EditTestBankView extends View {
    constructor(model) {
        super("section", "page edit-test-bank");
        this.model = model;
        this.numQuestions = 0;
        this.title = "Edit Questions";
    }

    render() {
        return `
            <header class="toolbar">
                <h2>All Questions</h2>
                <div class="actions">
                    <a class="action add-action" href="#edit/new">New Question</a>
                    <a class="action save-action disabled" download="Questions.json">Save Backup</a>
                    <a class="action load-action">Import Backup</a>
                    <a class="action" href="#">Done</a>
                </div>
            </header>
            <main>
                <table class="edit-questions">
                    <thead>
                        <th></th>
                        <th class="question">Question</th>
                        <th class="answer">Correct Answer</th>
                        <th class="incorrect-answers">Incorrect Answers</th>
                        <th></th>
                    </thead>
                    <tbody></tbody>
                </table>
            </main>
        `;
    }

    didRefresh() {
        this.removeObservers();
        this.numQuestions = 0;

        const addButton = this.querySelector(".actions a.add-action");
        const questionsTable = this.querySelector("table.edit-questions > tbody");
        const saveButton = this.querySelector(".actions a.save-action");
        const loadButton = this.querySelector(".actions a.load-action");
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
            <td class="answer"></td>
            <td class="incorrect-answers"></td>
            <td class="edit"><a class="button" href="#edit/${indexPlusOne}">Edit</a></td>
        `;
    }

    didRefresh() {
        const model = this.model;
        this.removeObservers();

        const questionCell = this.querySelector("td.question");
        const answerCell = this.querySelector("td.answer");
        const incorrectAnswersCell = this.querySelector("td.incorrect-answers");

        const updateQuestion = value => {
            questionCell.textContent = value;
        };
        const updateAnswer = value => {
            answerCell.textContent = value;
        };
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

        model.observe("question", this, updateQuestion);
        model.observe("answer", this, updateAnswer);
        model.observe("incorrectAnswers", this, updateIncorrect);
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