/**
 * Stand Up App
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/ui-icon-button.js";
import "/node_modules/@coderundebug/ui-web/ui-icon-link-button.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-question.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-settings.js";
import { PageNotification } from "../page-notification.js";
import { StandUpControl } from "../stand-up-control.js";
import { StandUpData } from "../stand-up-data.js";
import { SystemNotification } from "../system-notification.js";
import "../stand-up-settings/stand-up-settings.js";
import "../stand-up-view/stand-up-view.js";
import "../stand-up-welcome/stand-up-welcome.js";

// Load the stand up data
StandUpData.load();
StandUpData.loadState();

// Initialize modules
StandUpControl.initialize();
PageNotification.initialize();
SystemNotification.initialize();

export class StandUpApp extends HTMLElement {
    /**
     * Pages
     */
    static PAGE_WELCOME = 1;
    static PAGE_VIEW = 2;
    static PAGE_SETTINGS = 3;

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
        this._standUpWelcomeElement = this.shadowRoot.querySelector('stand-up-welcome');
        this._settingsElement = this.shadowRoot.getElementById('settings');

        // Set bind functions
        this._settingsClickEvent = this._settingsClickEvent.bind(this);
        this._standUpWelcomeCloseEvent = this._standUpWelcomeCloseEvent.bind(this);
        this._standUpSettingsCloseEvent = this._standUpSettingsCloseEvent.bind(this);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._settingsElement.addEventListener('click', this._settingsClickEvent);
        this._standUpWelcomeElement.addEventListener('close', this._standUpWelcomeCloseEvent);
        this._standUpSettingsElement.addEventListener('close', this._standUpSettingsCloseEvent);

        // Get system notification state
        const state = SystemNotification.getState();

        // If denied or unknown
        if (state === 'denied' || state === 'unknown') {
            // Show welcome
            this._showPage(StandUpApp.PAGE_WELCOME);
        }
        
        // Otherwise, the system notification is either granted or unavailable
        else {
            // Show view
            this._showPage(StandUpApp.PAGE_VIEW);
        }
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._settingsElement.removeEventListener('click', this._settingsClickEvent);
        this._standUpWelcomeElement.removeEventListener('close', this._standUpWelcomeCloseEvent);
        this._standUpSettingsElement.removeEventListener('close', this._standUpSettingsCloseEvent);
    }

    /**
     * Settings click event.
     */
    _settingsClickEvent() {
        // Show settings
        this._showPage(StandUpApp.PAGE_SETTINGS);
    }

    /**
     * Welcome close event.
     */
    _standUpWelcomeCloseEvent() {
        // Show view
        this._showPage(StandUpApp.PAGE_VIEW);
    }

    /**
     * Settings close event.
     */
    _standUpSettingsCloseEvent() {
        // Show view
        this._showPage(StandUpApp.PAGE_VIEW);
    }

    /**
     * Show the given page.
     * @param {Number} page The page to show (see PAGE_xxx).
     */
    _showPage(page) {
        // If page welcome
        if (page === StandUpApp.PAGE_WELCOME) {
            // Show welcome
            this._standUpWelcomeElement.setAttribute('active', '');
            this._standUpViewElement.removeAttribute('active');
            this._standUpSettingsElement.removeAttribute('active');

            // Hide the settings button
            this._settingsElement.style.display = 'none';

            // Turn off notifications
            StandUpData.useNotifications = false;
        }

        // If page view
        if (page === StandUpApp.PAGE_VIEW) {
            // Show view
            this._standUpWelcomeElement.removeAttribute('active');
            this._standUpViewElement.setAttribute('active', '');
            this._standUpSettingsElement.removeAttribute('active');

            // Show the settings button
            this._settingsElement.style.display = 'block';

            // Turn on notifications
            StandUpData.useNotifications = true;

            // Update the controls in the view page
            this._standUpViewElement.dataUpdated();
        }

        // If page settings
        if (page === StandUpApp.PAGE_SETTINGS) {
            // Show view
            this._standUpWelcomeElement.removeAttribute('active');
            this._standUpViewElement.removeAttribute('active');
            this._standUpSettingsElement.setAttribute('active', '');

            // Hide the settings button
            this._settingsElement.style.display = 'none';

            // Turn off notifications
            StandUpData.useNotifications = false;

            // Update the input controls in the settings page
            this._standUpSettingsElement.showSettings();
        }
    }
}

// Create the UI element
UiTools.createUi(StandUpApp, 'stand-up-app', import.meta.url);
