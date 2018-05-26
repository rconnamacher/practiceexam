import {View} from "./View.js";
import {TestBank} from "../models/TestBank.js";
import {homepage} from "localized/homepage.js";
import {LocaleSelectorView} from "./LocaleSelectorView.js";

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
                <div class="actions"></div>
            </header>
            <main>
                <p><a aria-role="button" class="button button-take-test${hasQuestions ? '' : ' disabled'}" href="#taketest/5">${homepage.take_test_button}</a>
                    ( <input type="number" class="num-questions" value="5"> ${homepage.questions})</p>
                <p><a aria-role="button" class="button" href="#edit">${homepage.edit_test_bank_button}</a></p>
            </main>
        `
    }

    didRefresh() {
        const numQuestionInput = this.requireSelector("input.num-questions");
        const takeTestButton = this.requireSelector("a.button-take-test");
        numQuestionInput.addEventListener("input", () => {
            takeTestButton.href = `#taketest/${numQuestionInput.value}`;
        });

        const headerActionsContainer = this.requireSelector('header div.actions');
        this.displaySubview(new LocaleSelectorView(), headerActionsContainer);
    }
}