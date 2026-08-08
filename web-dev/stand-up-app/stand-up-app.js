/**
 * Stand Up App
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/ui-icon-button.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-settings.js";
import { PageNotification } from "../page-notification.js";
import { StandUpControl } from "../stand-up-control.js";
import { StandUpData } from "../stand-up-data.js";
import { SystemNotification } from "../system-notification.js";
import "../stand-up-view/stand-up-view.js";
import "../stand-up-settings/stand-up-settings.js";

// Load the stand up data
StandUpData.load();

// Initialize modules
StandUpControl.initialize();
PageNotification.initialize();
SystemNotification.initialize();

export class StandUpApp extends HTMLElement {
    /**
     * Stand up app constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = StandUpApp.uiHtml;

        // Add CSS style sheet
        this.shadowRoot.adoptedStyleSheets = [StandUpApp.uiCssStyleSheet];

        // Get elements
        this._standUpSettingsElement = this.shadowRoot.querySelector('stand-up-settings');
        this._standUpViewElement = this.shadowRoot.querySelector('stand-up-view');
        this._settingsElement = this.shadowRoot.getElementById('settings');

        // Set bind functions
        this._settingsClickEvent = this._settingsClickEvent.bind(this);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._settingsElement.addEventListener('click', this._settingsClickEvent);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._settingsElement.removeEventListener('click', this._settingsClickEvent);
    }

    /**
     * Settings click event.
     */
    _settingsClickEvent() {
        // Show settings
        this._standUpSettingsElement.setAttribute('active', '');
        this._standUpViewElement.removeAttribute('active');
    }
}

// Create the UI element
UiTools.createUi(StandUpApp, 'stand-up-app', import.meta.url);
