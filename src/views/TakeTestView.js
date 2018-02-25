import {View} from "./View.js";
import {unique, lastUnique} from "../util/number.js";
import {shuffle} from "../util/random.js";
import {exam} from "localized/exam.js";
import {text} from "../util/html.js";

export class TakeTestView extends View {
    constructor(questions) {
        super("section", "page take-test");

        this.questions = questions;
        this.questionViews = [];
    }

    render() {
        return `
            <header><h2>${exam.title(this.questions.length)}</h2></header>
            <main class="test-questions"></main>
            <footer>
                <a class="button button-grade-test">${exam.grade_test_button}</a>
                <span class="test-results"></span>
            </footer>
        `
    }

    didRefresh() {
        this.questionViews = [];
        const questionsBlock = this.querySelector("main.test-questions");
        let index = 0;
        for (let question of this.questions) {
            const questionView = new TakeTestQuestionView(question, index++);
            this.displaySubview(questionView, questionsBlock);
            this.questionViews.push(questionView);
        }
        this.querySelector("a.button.button-grade-test").addEventListener("click", this.gradeTest.bind(this));
    }

    gradeTest() {
        let numCorrect = 0;
        const numQuestions = this.questions.length;
        for (let view of this.questionViews) {
            numCorrect += view.grade() ? 1 : 0;
        }
        const percentCorrect = Math.round(numCorrect * 100 / numQuestions);
        this.querySelector(".test-results").textContent = exam.test_results(numCorrect, numQuestions, percentCorrect);
    }
}

function _escape(string) {
    var container = document.createElement('span');
    container.textContent = string;
    return container.innerHTML;
}

export class TakeTestQuestionView extends View {
    constructor(question, index) {
        super("section", "question");
        this.model = question;
        this.index = index;
    }

    render() {
        const question = this.model;
        const correctAnswer = question.answer;
        const incorrectAnswer = question.incorrectAnswers;
        const allAnswers = shuffle(incorrectAnswer.concat([correctAnswer]));
        const questionId = `question-${this.index}`;
        let answerIndex = 0;
        let answerId;

        return `
            <h3 class="question ${questionId}">${this.index+1}. ${question.question}</h3>
            <ol class="answers" type="A">
                ${allAnswers.map(answer => (
                    answerId = `${questionId}-answer-${++answerIndex}`,
                    `
                        <li>
                            <input type="radio" name="${questionId}" value="${text(answer)}" id="${answerId}"
                            ><label for="${answerId}">${text(answer)}</label>
                        </li>
                    `
                )).join("")}
            </ol>
        `;
    }

    grade() {
        for (let row of this.querySelectorAll("li")) {
            row.classList.remove("incorrect", "correct");
        }

        const selectedRadio = this.querySelector("input:checked");
        const isCorrect = selectedRadio && (selectedRadio.value === this.model.answer);
        if (selectedRadio) {
            selectedRadio.parentNode.classList.add(isCorrect ? "correct" : "incorrect");
        }
        return isCorrect;
    }
}