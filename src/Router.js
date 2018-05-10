

export class Router {
    constructor(routeConfigs) {
        this.routes = routeConfigs;

        /** @type {function()} */
        this._onhashchange = () => {
            this.displayPath(location.hash.substr(1));
        }
    }

    start() {
        window.addEventListener("hashchange", this._onhashchange);
        this._onhashchange();
    }

    stop() {
        window.removeEventListener("hashchange", this._onhashchange);
    }

    displayPath(path) {
        let match;
        for (let route of this.routes) {
            if (match = route.pattern.exec(path)) {
                route.handler.apply(null, match);
                return;
            }
        }

        console.error("Unable to find handler for route "+path, this.routes);
    }
}