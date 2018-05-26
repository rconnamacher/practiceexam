"use strict";

module.exports = {
    baseDir: "src",

    variables: {
        // How to load from URLs. below means "locale" query parameter in the
        // original HTML URL that loaded this, with the default "en"
        "locale": {
            type: "query",
            name: "locale",
            default: "en-us"
        },
        "environment": {
            type: "query",
            name: "env",
            default: "dev"
        }
    },
    moduleSpecifiers: {
        "localized": variables => `localized/${variables.locale}`,
        "environment": variables => `env/config.${variables.environment}.js`,
    }
};