/**
 * PWA Install
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/ui-button.js";
import "/node_modules/@coderundebug/ui-web/ui-icon-button.js";
import "/node_modules/@coderundebug/ui-web/ui-lozenge.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-cross.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-download.js";

export class PwaInstall extends HTMLElement {
    /**
     * PWA install constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = PwaInstall.uiHtml;

        // Add CSS style sheet
        this.shadowRoot.adoptedStyleSheets = [PwaInstall.uiCssStyleSheet];

        // Get elements
        this._baseElement = this.shadowRoot.querySelector('.base');
        this._installElement = this.shadowRoot.getElementById('install');
        this._notNowElement = this.shadowRoot.getElementById('not-now');

        // Bind functions
        this._installClickEvent = this._installClickEvent.bind(this);
        this._notNowClickEvent = this._notNowClickEvent.bind(this);
        this._beforeInstallPromptEvent = this._beforeInstallPromptEvent.bind(this);

        // Set deferred prompt
        this._deferredPrompt = null;
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._installElement.addEventListener('click', this._installClickEvent);
        this._notNowElement.addEventListener('click', this._notNowClickEvent);
        window.addEventListener('beforeinstallprompt', this._beforeInstallPromptEvent);

        // Update the show
        this._updateShow();
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._installElement.removeEventListener('click', this._installClickEvent);
        this._notNowElement.removeEventListener('input', this._notNowClickEvent);
        window.removeEventListener('beforeinstallprompt', this._beforeInstallPromptEvent);
    }

    /**
     * Install click event.
     */
    async _installClickEvent() {
        // If nothing deferred
        if (!this._deferredPrompt) return;

        // Show the browser's installation dialog prompt
        this._deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this._deferredPrompt.userChoice;

        // If not accepted
        if (outcome !== 'accepted') {
            // Set not now when (ask again after 60 days)
            let notNowWhen = Date.now() + (60 * 24 * 60 * 60 * 1000);

            // Set local storage item
            localStorage.setItem('not-now', notNowWhen.toString());
        }

        // Clear the saved event; it can only be used once
        this._deferredPrompt = null;

        // Remove "show" attribute
        this._baseElement.removeAttribute('show');
    }

    /**
     * Not now click event.
     */
    _notNowClickEvent() {
        // Set not now when (ask again after 60 days)
        let notNowWhen = Date.now() + (60 * 24 * 60 * 60 * 1000);

        // Set local storage item
        localStorage.setItem('not-now', notNowWhen.toString());

        // Remove "show" attribute
        this._baseElement.removeAttribute('show');
    }

    /**
     * Before install prompt event.
     * @param {Object} event Information about the event.
     */
    _beforeInstallPromptEvent(event) {
        // Prevent the default browser mini-infobar from appearing
        event.preventDefault();
        
        // Save the event so it can be triggered later
        this._deferredPrompt = event;

        // Update the show
        this._updateShow();
    }

    /**
     * Update to show the install message.
     */
    _updateShow() {
        // Set show
        let show = true;

        // Check not now
        const notNow = localStorage.getItem('not-now');

        // If found
        if (notNow) {
            // Convert to date
            const notNowWhen = new Date(parseInt(notNow));

            // If not expired
            if (notNowWhen > new Date()) {
                // Set to not show
                show = false;
            }
        }

        // Check URL search
        if (window.location.search.includes('mode=app') === true) {
            // Set to not show
            show = false;
        }

        // If not install prompt (Safari)
        if (!this._deferredPrompt) show = false;

        // If showing
        if (show === true) {
            // Add the "show" attribute
            this._baseElement.setAttribute('show', '');
        } else {
            // Remove the "show" attribute
            this._baseElement.removeAttribute('show');
        }
    }
}

// Create the UI element
UiTools.createUi(PwaInstall, 'pwa-install', import.meta.url);
