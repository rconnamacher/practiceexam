import {ModalView} from "./ModalView.js";
import {TestBank} from "../models/TestBank.js";

export class ExportQuestionsModal extends ModalView {
    constructor(/** !TestBank */ model) {
        super();
        this.model = model;
    }

    render() {
        return super.renderModal(`
            <header>
                <h3>Export Questions</h3>
            </header>
            <main>
                <div><label for="file_name_input">File Name:</label><input type="text" id="file_name_input" value="Questions.json"></div>
            </main>
            <footer>
                <a class="button cancel-button">Cancel</a>
                <a class="button save-button disabled">Save</a>
            </footer>
        `);
    }

    didRefresh() {
        const cancelButton = this.querySelector("a.button.cancel-button");
        const fileNameInput = this.querySelector("input#file_name_input");
        const saveButton = this.querySelector("a.button.save-button");

        cancelButton.addEventListener("click", this.close.bind(this));

        const saveData = JSON.stringify(this.model.exportFields(), null, 2);
        saveButton.href = "data:text/plain;charset=utf-8," + encodeURIComponent(saveData);

        saveButton.classList.remove("disabled");

        function updateFileName() {
            const fileName = fileNameInput.value;
            saveButton.setAttribute("download", fileName);
            saveButton.classList.toggle("disabled", !fileName);
        }
        updateFileName();
        fileNameInput.addEventListener("input", updateFileName);
        saveButton.addEventListener("click", () => {
            // Allow the default save operation to pass, then...
            setTimeout(() => {
                this.close();
            }, 25);
        })
    }
}