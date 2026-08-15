/**
 * Info page
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/ui-button.js";
import "/node_modules/@coderundebug/ui-web/ui-group.js";
import "/node_modules/@coderundebug/ui-web/ui-link-button.js";
import "/node_modules/@coderundebug/ui-web/ui-lozenge.js";
import "/node_modules/@coderundebug/ui-web/ui-icon-link-button.js";
import "/node_modules/@coderundebug/ui-web/ui-tab.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-check.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-cross.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-heart.js";
import "../web-site.js";

export class InfoPage extends HTMLElement {
    /**
     * Info page constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = InfoPage.uiHtml;

        // Add CSS style sheet
        this.shadowRoot.adoptedStyleSheets = [InfoPage.uiCssStyleSheet];
    }
}

// Create the UI element
UiTools.createUi(InfoPage, 'info-page', import.meta.url);
