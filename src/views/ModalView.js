import {View} from "./View.js";

export class ModalView extends View {
    constructor(className="") {
        super("div", `modal-dialog${className && " " + className}`);
        this.onclose = null;
    }

    renderModal(contents) {
        return `<section>${contents}</section>`;
    }

    close() {
        if (this.onclose) {
            this.onclose.call(null);
        }
    }
}