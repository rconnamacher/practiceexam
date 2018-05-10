
export class View {
    constructor(/** !string= */ tagName="div", /** !string=*/ className="") {
        /** @type {!Element} */
        this.domElement = document.createElement(tagName);
        this.domElement.className = className;

        /** @type {!boolean} */
        this.rendered = false;

        /** @private
         * @type {!Array<!View>} */
        this._subviews = [];

        /** @type {!string} */
        this.title = "";
    }

    addSubview(/** !View */ view) {
        this._subviews.push(view);
    }

    display(/** !Element */ where) {
        this.refresh();
        for (let subView of this._subviews) {
            subView.refresh();
        }

        where.appendChild(this.domElement);
    }

    displaySubview(/** !View */ view, /** !Element= */ where=this.domElement) {
        view.display(where);
        this.addSubview(view);
    }

    removeSubview(/** !View */ view) {
        const subviews = this._subviews;
        for (let i = 0, l=subviews.length; i < l; i++) {
            const subview = subviews[i];
            if (subview === view) {
                subviews.splice(i, 1);
                subview.remove();
            }
        }
    }

    remove() {
        const parentNode = this.domElement.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.domElement);
        } else {
            console.warn("Couldn't remove view because it has no parentNode:", this.domElement);
        }
        this.didRemove();
        for (let subView of this._subviews) {
            subView.didRemove();
        }
    }

    /** @returns {?Element} */
    querySelector(query) {
        return this.domElement.querySelector(query);
    }

    /** @returns {!Element} */
    requireSelector(query) {
        const element = this.domElement.querySelector(query);
        if (!element) {
            throw new Error(`Required selector ${query} not found`);
        }
        return element;
    }

    /** @returns {!NodeList<!Element>} */
    querySelectorAll(query) {
        return this.domElement.querySelectorAll(query);
    }

    refresh() {
        const html = this.render();
        if (html) {
            this.domElement.innerHTML = html;

            for (let subView of this._subviews) {
                subView.didRemove();
            }
            this._subviews = [];
        }
        this.rendered = true;
        this.didRefresh();
    }

    /** @returns {!string|undefined} */
    render() { }

    didRefresh() { }

    didRemove() { }
}