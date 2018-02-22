import {ModalView} from "./ModalView.js";
import {TestBank} from "../models/TestBank.js";

export class ImportQuestionsModal extends ModalView {
    constructor(/** !TestBank */ model) {
        super();
        this.model = model;
        this.importModel = null;
    }

    render() {
        return super.renderModal(`
            <header>
                <h3>Select file to import:</h3>
            </header>
            <main>
                <div><input type="file" name="import" accept=".json"></div>
                <p><em>This will replace all loaded questions with the one from the backup file.</em></p>
                <div class="alert error hidden"></div>
            </main>
            <footer>
                <a class="button cancel-button">Cancel</a>
                <a class="button load-button disabled">Import</a>
            </footer>
        `);
    }

    didRefresh() {
        const cancelButton = this.querySelector("a.button.cancel-button");
        const fileInput = this.querySelector("input[type=file]");
        const loadButton = this.querySelector("a.button.load-button");

        cancelButton.addEventListener("click", this.close.bind(this));
        fileInput.addEventListener("change", this.fileChanged.bind(this), false);

        loadButton.addEventListener("click", () => {
            if (this.importModel) {
                this.model.set("questions", this.importModel.get("questions"));
                this.close();
            }
        });
    }

    fileChanged(event) {
        event.preventDefault();
        event.stopPropagation();

        this.importModel = null;
        const file = event.target.files[0];
        const errorAlert = this.querySelector("div.alert.error");
        const loadButton = this.querySelector("a.button.load-button");

        loadButton.classList.add("disabled");
        errorAlert.classList.add("hidden");
        errorAlert.textContent = "";

        if (file) {
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const jsonString = /** @type {!string} */ (reader.result);
                    const importData = /** @type {!Object} */ (JSON.parse(jsonString));
                    const importModel = new TestBank(importData);
                    if (importModel.questions.length) {
                        this.importModel = importModel;
                        loadButton.classList.remove("disabled");
                    }
                } catch (e) {
                    errorAlert.textContent = "Couldn't read file " + file.name;
                    errorAlert.classList.remove("hidden");
                }
            }
            reader.onerror = event => {
                errorAlert.textContent = "An error happened loading the file";
                errorAlert.classList.remove("hidden");
            }
            reader.readAsText(file);
        }

    }
}