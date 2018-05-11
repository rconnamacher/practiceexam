
import {HomePageView} from "./views/HomePageView.js";
import {TakeTestView} from "./views/TakeTestView.js";
import {EditQuestionView} from "./views/EditQuestionView.js";
import {EditTestBankView} from "./views/EditTestBankView.js";
import {Router} from "./Router.js";
import {TestBank} from "./models/TestBank.js";
import {Question} from "./models/Question.js";
import {View} from "./views/View.js";
import {shuffle} from "./util/random.js";
import {defaultSave} from "localized/defaultSave.js";
import {strings} from "localized/general.js";

export class Application extends View {
    constructor() {
        super("div", "app");

        this.currentView = null;
        this.baseModel = null;

        this.router = new Router([
            {
                pattern: /^$/,
                handler: this.displayHomePage.bind(this)
            },
            {
                pattern: /^taketest$/,
                handler: this.displayTakeTestPage.bind(this)
            },
            {
                pattern: /^taketest\/(\d+)$/,
                handler: this.displayTakeTestPage.bind(this)
            },
            {
                pattern: /^edit$/,
                handler: this.displayEditBankRoute.bind(this)
            },
            {
                pattern: /^edit\/(\d+)$/,
                handler: this.displayEditQuestionRoute.bind(this)
            },
            {
                pattern: /^edit\/new$/,
                handler: this.displayNewQuestionRoute.bind(this)
            },
            {
                pattern: /.*/,
                handler: this.display404.bind(this)
            },
        ]);
    }

    startup() {
        this.loadTestBank();
        this.display(document.body);
        this.router.start();
    }

    render() {
        return ``;
    }

    displayView(ViewClass, model) {
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }
        let view = new ViewClass(model);
        view.display(this.domElement);
        this.currentView = view;
        document.title = view.title || strings.default_title;

        return view;
    }

    displayHomePage() {
        this.displayView(HomePageView, this.baseModel);
    }

    displayTakeTestPage(path, length) {
        length = parseInt(length, 10) || 5;

        const testQuestions = shuffle(this.baseModel.questions).slice(0, length);
        this.displayView(TakeTestView, testQuestions);
    }

    displayEditBankRoute() {
        this.displayView(EditTestBankView, this.baseModel);
    }

    saveTestBank() {
        localStorage.setItem("questionStore", JSON.stringify(this.baseModel.exportFields()));
    }

    loadTestBank() {
        if (this.baseModel) {
            this.baseModel.unobserve("questions", this);
        }

        const model = new TestBank();
        const saveData = localStorage.getItem("questionStore") || JSON.stringify(defaultSave);
        if (saveData) {
            try {
                model.load(JSON.parse(saveData));
            } catch (e) {
                console.error("Unable to parse save data: ", e);
            }
        }

        model.observe("questions", this, () => {
            console.log("Application: observed update to questions field");
            this.saveTestBank();
        });

        this.baseModel = model;
    }

    displayEditQuestionRoute(path, questionId) {
        const index = parseInt(questionId, 10) - 1;
        const questionModel = this.baseModel.questions[index];
        if (questionModel) {
            const view = this.displayView(EditQuestionView, questionModel);
            view.onsave = () => {
                this.saveTestBank();
                location.hash = "#edit";
            }
        } else {
            this.display404(path);
        }
    }

    displayNewQuestionRoute(path, questionId) {
        const questionModel = new Question();
        const view = this.displayView(EditQuestionView, questionModel);
        view.onsave = () => {
            if (questionModel.question) {
                this.baseModel.append("questions", questionModel);
            }
            this.saveTestBank();
            location.hash = "#edit"
        }
    }

    display404(path) {
        console.log("Will display 404: ", path);
    }
}

