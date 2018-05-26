import {View} from "./View.js";
import {homepage} from "localized/homepage.js";
import {LOCALE, strings} from "localized/general.js";

export class LocaleSelectorView extends View {
    constructor() {
        super("div", "locale-selector action select");
    }

    render() {
        const supportedLocales = {
            "en-us": "🇺🇸 US English",
            "es": "🇪🇸 Español",
        };
        const html = `<span aria-hidden="true">${supportedLocales[LOCALE].split(' ')[0]}</span>
            <select id="lang_selector" aria-hidden="false" aria-label="${strings.select_language_label}">${
                Object.keys(supportedLocales).map(
                    locale => `<option value="${locale}" ${locale === LOCALE ? 'selected' : ''}>${supportedLocales[locale]}</option>`
                ).join("")}
            </select>`;

        return html
    }

    didRefresh() {
        const select = this.requireSelector('select');

        select.addEventListener("change", event => {
            const newLocale = select.value;
            if (newLocale) {
                this.changeLocale(newLocale);
            }
        });
    }

    changeLocale(newLocale) {
        if (COMPILED) {
            const indexPath = newLocale === "en-us" ? "" : `index-${newLocale}.html`;
            // Replace the
            location.pathname = location.pathname.replace(/[^/]*$/, indexPath);
        } else {
            const query = newLocale === "en-us" ? "" : `?locale=${newLocale}`;
            location.search = query;
        }
    }
}