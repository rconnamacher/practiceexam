import {View} from "./View.js";
import {TestBank} from "../models/TestBank.js";

export class HomePageView extends View {
    constructor(model) {
        super("section", "page homepage");
        this.model = model;
    }

    render() {
        const hasQuestions = this.model.questions.length;
        return `
            <header>
                <h2>Ria Practice Exam</h2>
            </header>
            <main>
                <p><a class="button button-take-test${hasQuestions ? '' : ' disabled'}" href="#taketest/5">Take Sample Test</a> ( <input type="number" class="num-questions" value="5"> Questions)</p>
                <p><a class="button" href="#edit">Edit Test Bank</a></p>
            </main>
        `
    }

    didRefresh() {
        const numQuestionInput = this.querySelector("input.num-questions");
        const takeTestButton = this.querySelector("a.button-take-test");
        numQuestionInput.addEventListener("input", () => {
            takeTestButton.href = `#taketest/${numQuestionInput.value}`;
        });
    }
}