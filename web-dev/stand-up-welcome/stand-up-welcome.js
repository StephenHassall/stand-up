/**
 * Stand Up Welcome
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/ui-button.js";
import { SystemNotification } from "../system-notification.js";

export class StandUpWelcome extends HTMLElement {
    /**
     * Stand up welcome constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = StandUpWelcome.uiHtml;

        // Add CSS style sheet
        this.shadowRoot.adoptedStyleSheets = [StandUpWelcome.uiCssStyleSheet];

        // Get elements
        this._turnOnElement = this.shadowRoot.getElementById('turn-on');
        this._unknownElement = this.shadowRoot.getElementById('unknown');
        this._deniedElement = this.shadowRoot.getElementById('denied');

        // Bind functions
        this._turnOnClickEvent = this._turnOnClickEvent.bind(this);
        this._checkState = this._checkState.bind(this);

        // Set state flag
        this._state = 0;
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._turnOnElement.addEventListener('click', this._turnOnClickEvent);

        // Check the state
        this._checkState();

        // Start the timer
        this._timerId = setInterval(this._checkState, 250);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._turnOnElement.removeEventListener('click', this._turnOnClickEvent);

        // Clear interval
        clearInterval(this._timerId);
    }

    /**
     * Turn on click event.
     */
    async _turnOnClickEvent() {
        // Ask the user for permission
        const result = await SystemNotification.askForPermission();

        // If not granted
        if (result !== 'granted') return;

        // Create close event
        const closeEvent = new CustomEvent('close');

        // Dispatch the event
        this.dispatchEvent(closeEvent);        
    }

    /**
     * Check state.
     */
    _checkState() {
        // Get system notification state
        const state = SystemNotification.getState();

        // If nothing has changed
        if (state === 'unknown' && this._state === 1) return;
        if (state === 'denied' && this._state === 2) return;

        // If unknown
        if (state === 'unknown') {
            // Show the unknown text
            this._unknownElement.style.display = 'grid';
            this._deniedElement.style.display = 'none';

            // Set state flag
            this._state = 1;
        }

        // If denied
        if (state === 'denied') {
            // Show the denied text
            this._unknownElement.style.display = 'none';
            this._deniedElement.style.display = 'grid';

            // Set state flag
            this._state = 2;
        }
    }
}

// Create the UI element
UiTools.createUi(StandUpWelcome, 'stand-up-welcome', import.meta.url);
