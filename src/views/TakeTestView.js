import {View} from "./View.js";
import {unique, lastUnique} from "../util/number.js";
import {shuffle} from "../util/random.js";

export class TakeTestView extends View {
    constructor(questions) {
        super("section", "page take-test");

        this.questions = questions;
        this.questionViews = [];
    }

    render() {
        return `
            <header><h2>Sample Test: ${this.questions.length} Questions</h2></header>
            <main class="test-questions"></main>
            <footer>
                <a class="button button-grade-test">Grade Test</a>
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
        this.querySelector(".test-results").textContent = `${numCorrect} correct out of ${numQuestions} (${Math.round(numCorrect * 100 / numQuestions)}%)`;
    }
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
                            <input type="radio" name="${questionId}" value="${answer}" id="${answerId}"
                            ><label for="${answerId}">${answer}</label>
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