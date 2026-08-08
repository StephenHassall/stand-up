/**
 * Stand Up Settings
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-cross.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-check.js";
import "/node_modules/@coderundebug/ui-web/ui-label.js";
import "/node_modules/@coderundebug/ui-web/ui-select.js";
import "/node_modules/@coderundebug/ui-web/ui-checkbox.js";
import { StandUpData } from "../stand-up-data.js";

export class StandUpSettings extends HTMLElement {
    /**
     * Stand up settings constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = StandUpSettings.uiHtml;

        // Add CSS style sheet
        this.shadowRoot.adoptedStyleSheets = [StandUpSettings.uiCssStyleSheet];

        // Get elements
        this._baseElement = this.shadowRoot.querySelector('.base');
        this._timerSwitchElement = this.shadowRoot.getElementById('timer-switch');
        this._timerFixedElement = this.shadowRoot.getElementById('timer-fixed');
        this._fixedGroupElement = this.shadowRoot.querySelector('.fixed-group');

        // Bind functions
        this._timerSwitchClickEvent = this._timerSwitchClickEvent.bind(this);
        this._timerFixedClickEvent = this._timerFixedClickEvent.bind(this);

        // Add fixed group
        this._addFixedGroup();
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._timerSwitchElement.addEventListener('click', this._timerSwitchClickEvent);
        this._timerFixedElement.addEventListener('click', this._timerFixedClickEvent);

        // If timer type is switch
        if (StandUpData.timerType === 0) {
            // Highlight switch mode
            this._timerSwitchElement.setAttribute('success', '');
            this._timerFixedElement.removeAttribute('success');

            // Set base element
            this._baseElement.setAttribute('switch', '');
            this._baseElement.removeAttribute('fixed');
        }
        
        // Else if is fixed
        else {
            // Highlight fixed mode
            this._timerFixedElement.setAttribute('success', '');
            this._timerSwitchElement.removeAttribute('success');

            // Set base element
            this._baseElement.setAttribute('fixed', '');
            this._baseElement.removeAttribute('switch');
        }
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._timerSwitchElement.removeEventListener('click', this._timerSwitchClickEvent);
        this._timerFixedElement.removeEventListener('click', this._timerFixedClickEvent);
    }

    /**
     * Timer switch click event.
     */
    _timerSwitchClickEvent() {
        // Check the color of the button
        this._timerSwitchElement.setAttribute('success', '');
        this._timerFixedElement.removeAttribute('success');

        // Set base element
        this._baseElement.setAttribute('switch', '');
        this._baseElement.removeAttribute('fixed');
    }

    /**
     * Timer fixed click event.
     */
    _timerFixedClickEvent() {
        // Check the color of the button
        this._timerFixedElement.setAttribute('success', '');
        this._timerSwitchElement.removeAttribute('success');

        // Set base element
        this._baseElement.setAttribute('fixed', '');
        this._baseElement.removeAttribute('switch');
    }

    /**
     * Add the fixed group elements.
     */
    _addFixedGroup() {
        // If no fixed stand items yet
        if (StandUpData.fixedStandList.length === 0) {
            // Create row element
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            // Create label element
            const labelElement = document.createElement('ui-label');
            labelElement.innerText = 'Stand Times';

            // Create button element
            this._addStandTimeButtonElement = document.createElement('ui-button');
            this._addStandTimeButtonElement.classList.add('add-time');
            this._addStandTimeButtonElement.innerText = 'Add Time';

            // Add elements together
            this._fixedGroupElement.appendChild(rowElement);
            rowElement.appendChild(labelElement);
            rowElement.appendChild(this._addStandTimeButtonElement);

            // Stop here
            return;
        }

        // For each fixed stand
        for (let index = 0; index < StandUpData.fixedStandList.length; index++) {
            // Create row element
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            // If first index
            if (index === 0) {
                // Create label element
                const labelElement = document.createElement('ui-label');
                labelElement.innerText = 'Stand Times';

                // Add to row
                rowElement.appendChild(labelElement);
            }

            // Else if this is another index
            else {
                // Create empty element
                const emptyElement = document.createElement('div');

                // Add to row
                rowElement.appendChild(emptyElement);
            }

            // Create time block
            const timeBlockElement = document.createElement('div');
            timeBlockElement.classList.add('time-block');

            // Create hour select element
            const hourSelectElement = document.createElement('ui-select');

            // Create inner hour elements
            for (let hour = 0; hour < 24; hour++) {
                // Create div value
                const divValue = document.createElement('div');
                divValue.setAttribute('value', hour.toString());
                divValue.innerText = hour.toString();

                // Add to select element
                hourSelectElement.appendChild(divValue);
            }

            // Create minute select element
            const minuteSelectElement = document.createElement('ui-select');

            // Create inner minute elements
            for (let minute = 0; minute < 60; minute += 5) {
                // Create div value
                const divValue = document.createElement('div');
                divValue.setAttribute('value', minute.toString());
                divValue.innerText = minute.toString();

                // Add to select element
                minuteSelectElement.appendChild(divValue);
            }

            // Create delete icon button
            const deleteIconButtonElement = document.createElement('ui-icon-button');
            deleteIconButtonElement.setAttribute('blank', '');
            deleteIconButtonElement.setAttribute('danger', '');

            // Create cross icon
            const crossIconElement = document.createElement('ui-icon-cross');

            // Add all the elements together
            deleteIconButtonElement.appendChild(crossIconElement);
            timeBlockElement.appendChild(hourSelectElement);
            timeBlockElement.appendChild(minuteSelectElement);
            timeBlockElement.appendChild(deleteIconButtonElement);
            rowElement.appendChild(timeBlockElement);

            // Add elements together
            this._fixedGroupElement.appendChild(rowElement);
        }

        // Create final button row element
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');

        // Create empty div element
        const emptyElement = document.createElement('div');

        // Create button element
        this._addStandTimeButtonElement = document.createElement('ui-button');
        this._addStandTimeButtonElement.classList.add('add-time');
        this._addStandTimeButtonElement.innerText = 'Add Time';

        // Add elements together
        this._fixedGroupElement.appendChild(rowElement);
        rowElement.appendChild(emptyElement);
        rowElement.appendChild(this._addStandTimeButtonElement);
    }
}

// Create the UI element
UiTools.createUi(StandUpSettings, 'stand-up-settings', import.meta.url);
