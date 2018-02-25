import {View} from "./View.js";
import {TestBank} from "../models/TestBank.js";
import {homepage} from "localized/homepage.js";

export class HomePageView extends View {
    constructor(model) {
        super("section", "page homepage");
        this.model = model;
    }

    render() {
        const hasQuestions = this.model.questions.length;
        return `
            <header>
                <h2>${homepage.title}</h2>
            </header>
            <main>
                <p><a class="button button-take-test${hasQuestions ? '' : ' disabled'}" href="#taketest/5">${homepage.take_test_button}</a>
                    ( <input type="number" class="num-questions" value="5"> ${homepage.questions})</p>
                <p><a class="button" href="#edit">${homepage.edit_test_bank_button}</a></p>
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