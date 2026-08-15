/**
 * Stand Up Settings
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-cross.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-check.js";
import "/node_modules/@coderundebug/ui-web/ui-label.js";
import "/node_modules/@coderundebug/ui-web/ui-select.js";
import UiTheme from "/node_modules/@coderundebug/ui-web/ui-theme.js";
import "/node_modules/@coderundebug/ui-web/ui-checkbox.js";
import { StandUpControl } from "../stand-up-control.js";
import { StandUpData } from "../stand-up-data.js";
import { SystemNotification } from "../system-notification.js";

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
        this._closeElement = this.shadowRoot.getElementById('close');
        this._timerSwitchElement = this.shadowRoot.getElementById('timer-switch');
        this._timerFixedElement = this.shadowRoot.getElementById('timer-fixed');
        this._sitTimeElement = this.shadowRoot.getElementById('sit-time');
        this._standTimeElement = this.shadowRoot.getElementById('stand-time');
        this._fixedGroupElement = this.shadowRoot.querySelector('.fixed-group');
        this._startStandingElement = this.shadowRoot.getElementById('start-standing');
        this._useSystemNotificationsElement = this.shadowRoot.getElementById('use-system-notifications');
        this._usePageNotificationsElement = this.shadowRoot.getElementById('use-page-notifications');
        this._themeElement = this.shadowRoot.getElementById('theme');

        // Bind functions
        this._closeClickEvent = this._closeClickEvent.bind(this);
        this._timerSwitchClickEvent = this._timerSwitchClickEvent.bind(this);
        this._timerFixedClickEvent = this._timerFixedClickEvent.bind(this);
        this._sitTimeChangeEvent = this._sitTimeChangeEvent.bind(this);
        this._standTimeChangeEvent = this._standTimeChangeEvent.bind(this);
        this._addStandTimeButtonClickEvent = this._addStandTimeButtonClickEvent.bind(this);
        this._fixedGroupClickEvent = this._fixedGroupClickEvent.bind(this);
        this._fixedGroupChangeEvent = this._fixedGroupChangeEvent.bind(this);
        this._startStandingChangeEvent = this._startStandingChangeEvent.bind(this);
        this._useSystemNotificationChangeEvent = this._useSystemNotificationChangeEvent.bind(this);
        this._usePageNotificationChangeEvent = this._usePageNotificationChangeEvent.bind(this);
        this._themeChangeEvent = this._themeChangeEvent.bind(this);

        // Add fixed group
        this._addFixedGroup();

        // Set showing flag
        this._showingFlag = false;
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._closeElement.addEventListener('click', this._closeClickEvent);
        this._timerSwitchElement.addEventListener('click', this._timerSwitchClickEvent);
        this._timerFixedElement.addEventListener('click', this._timerFixedClickEvent);
        this._sitTimeElement.addEventListener('change', this._sitTimeChangeEvent);
        this._standTimeElement.addEventListener('change', this._standTimeChangeEvent);
        this._fixedGroupElement.addEventListener('click', this._fixedGroupClickEvent);
        this._fixedGroupElement.addEventListener('change', this._fixedGroupChangeEvent);
        this._startStandingElement.addEventListener('change', this._startStandingChangeEvent);
        this._useSystemNotificationsElement.addEventListener('change', this._useSystemNotificationChangeEvent);
        this._usePageNotificationsElement.addEventListener('change', this._usePageNotificationChangeEvent);
        this._themeElement.addEventListener('change', this._themeChangeEvent);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._closeElement.removeEventListener('click', this._closeClickEvent);
        this._timerSwitchElement.removeEventListener('click', this._timerSwitchClickEvent);
        this._timerFixedElement.removeEventListener('click', this._timerFixedClickEvent);
        this._sitTimeElement.removeEventListener('change', this._sitTimeChangeEvent);
        this._standTimeElement.removeEventListener('change', this._standTimeChangeEvent);
        this._fixedGroupElement.removeEventListener('click', this._fixedGroupClickEvent);
        this._fixedGroupElement.removeEventListener('change', this._fixedGroupChangeEvent);
        this._startStandingElement.removeEventListener('change', this._startStandingChangeEvent);
        this._useSystemNotificationsElement.removeEventListener('change', this._useSystemNotificationChangeEvent);
        this._usePageNotificationsElement.removeEventListener('change', this._usePageNotificationChangeEvent);
        this._themeElement.removeEventListener('change', this._themeChangeEvent);

        // If add stand time button exists
        if (this._addStandTimeButtonElement) {
            // Remove event
            this._addStandTimeButtonElement.removeEventListener('click', this._addStandTimeButtonClickEvent);
        }
    }

    /**
     * Show the settings.
     */
    showSettings() {
        // Set showing flag
        this._showingFlag = true;

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

        // Set sit and stand times
        this._sitTimeElement.value = StandUpData.sitTime.toString();
        this._standTimeElement.value = StandUpData.standTime.toString();

        // Set check boxes
        this._startStandingElement.checked = StandUpData.startStanding;
        this._useSystemNotificationsElement.checked = StandUpData.useSystemNotifications;
        this._usePageNotificationsElement.checked = StandUpData.usePageNotifications;

        // Set theme
        this._themeElement.value = StandUpData.theme;

        // Get system notification state
        const state = SystemNotification.getState();

        // If unavailable
        if (state === 'unavailable') {
            // Hide the row the use notifications checkbox lives in
            this._useSystemNotificationsElement.parentElement.style.display = 'none';
        }

        // Reset showing flag
        this._showingFlag = false;
    }

    /**
     * Close click event
     */
    _closeClickEvent() {
        // Create close event
        const closeEvent = new CustomEvent('close');

        // Dispatch the event
        this.dispatchEvent(closeEvent);
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

        // Set timer type
        StandUpData.timerType = 0;

        // Reset and save it
        this._resetAndSave();
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

        // Set timer type
        StandUpData.timerType = 1;

        // Save settings
        StandUpData.save();
    }

    /**
     * Sit time change event.
     */
    _sitTimeChangeEvent() {
        // Update data
        StandUpData.sitTime = parseInt(this._sitTimeElement.value);

        // Reset and save it
        this._resetAndSave();
    }

    /**
     * Stand time change event.
     */
    _standTimeChangeEvent() {
        // Update data
        StandUpData.standTime = parseInt(this._standTimeElement.value);

        // Reset and save it
        this._resetAndSave();
    }

    /**
     * Add stand time button click event.
     */
    _addStandTimeButtonClickEvent() {
        // If no fixed stand list items yet
        if (StandUpData.fixedStandList.length === 0) {
            // Get the time now
            const now = new Date();

            // Create a new fixed stand date that uses this current hour
            const fixedStand = new Date(2000, 0, 1, now.getHours());

            // Add to fixed stand list
            StandUpData.fixedStandList.push(fixedStand);

            // Recreate the fixed group and stop here
            this._addFixedGroup();
            return;
        }

        // Get the last fixed stand
        const lastFixedStand = StandUpData.fixedStandList[StandUpData.fixedStandList.length - 1];

        // Create a new fixed stand date that uses the last fixed stand plus an hour
        const fixedStand = new Date(2000, 0, 1, lastFixedStand.getHours() + 1, lastFixedStand.getMinutes());

        // Add to fixed stand list
        StandUpData.fixedStandList.push(fixedStand);

        // Recreate the fixed group
        this._addFixedGroup();
    }

    /**
     * Fixed group change event.
     * @param {Object} event Information about the event.
     */
    _fixedGroupChangeEvent(event) {
        // If hour change
        if (event.target.dataset.hourIndex) {
            // Get index of the fixed stand
            const index = parseInt(event.target.dataset.hourIndex);

            // Get fixed stand
            const fixedStand = StandUpData.fixedStandList[index];

            // Reset the hour value
            fixedStand.setHours(parseInt(event.target.value));
            
            // Save settings
            StandUpData.save();
        }

        // If minute change
        if (event.target.dataset.minuteIndex) {
            // Get index of the fixed stand
            const index = parseInt(event.target.dataset.minuteIndex);

            // Get fixed stand
            const fixedStand = StandUpData.fixedStandList[index];

            // Reset the minute value
            fixedStand.setMinutes(parseInt(event.target.value));
            
            // Save settings
            StandUpData.save();
        }
    }

    /**
     * Fixed group click event.
     * @param {Object} event Information about the event.
     */
    _fixedGroupClickEvent(event) {
        // If delete button clicked
        if (event.target.dataset.deleteIndex) {
            // Get index of the fixed stand
            const index = parseInt(event.target.dataset.deleteIndex);

            // Remove the fixed stand from the list
            StandUpData.fixedStandList.splice(index, 1);

            // Recreate the fixed group and stop here
            this._addFixedGroup();
            return;
        }
    }

    /**
     * Start standing change event.
     */
    _startStandingChangeEvent() {
        // Update data
        StandUpData.startStanding = this._startStandingElement.checked;

        // Reset and save it
        this._resetAndSave();
    }

    /**
     * Use system notification change event.
     */
    _useSystemNotificationChangeEvent() {
        // Update data
        StandUpData.useSystemNotifications = this._useSystemNotificationsElement.checked;

        // Save settings
        StandUpData.save();        
    }

    /**
     * Use page notification change event.
     */
    _usePageNotificationChangeEvent() {
        // Update data
        StandUpData.usePageNotifications = this._usePageNotificationsElement.checked;

        // Save settings
        StandUpData.save();
    }

    /**
     * Theme change event.
     */
    _themeChangeEvent() {
        // Update data
        StandUpData.theme = this._themeElement.value;

        // Save settings
        StandUpData.save();

        // Set theme file
        const file = '/' + this._themeElement.value + '.css';

        // Set the new theme
        UiTheme.switchPageTheme(file);
    }

    /**
     * Add the fixed group elements.
     */
    _addFixedGroup() {
        // If add stand time button exists
        if (this._addStandTimeButtonElement) {
            // Remove events
            this._addStandTimeButtonElement.removeEventListener('click', this._addStandTimeButtonClickEvent);
        }

        // Clear anything that exist already
        this._fixedGroupElement.innerHTML = '';

        // If no fixed stand items yet
        if (StandUpData.fixedStandList.length === 0) {
            // Create row element
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            // Create label element
            const labelElement = document.createElement('ui-label');
            labelElement.innerText = 'Fixed Times';

            // Create button element
            this._addStandTimeButtonElement = document.createElement('ui-button');
            this._addStandTimeButtonElement.classList.add('add-time');
            this._addStandTimeButtonElement.innerText = 'Add Time';

            // Add elements together
            this._fixedGroupElement.appendChild(rowElement);
            rowElement.appendChild(labelElement);
            rowElement.appendChild(this._addStandTimeButtonElement);

            // Add event
            this._addStandTimeButtonElement.addEventListener('click', this._addStandTimeButtonClickEvent);

            // Stop here
            return;
        }

        // For each fixed stand
        for (let index = 0; index < StandUpData.fixedStandList.length; index++) {
            // Get fixed stand
            const fixedStand = StandUpData.fixedStandList[index];

            // Get hour and minute
            const hour = fixedStand.getHours();
            const minute = fixedStand.getMinutes();

            // Create row element
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            // If first index
            if (index === 0) {
                // Create label element
                const labelElement = document.createElement('ui-label');
                labelElement.innerText = 'Fixed Times';

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
            hourSelectElement.setAttribute('data-hour-index', index.toString());

            // Create inner hour elements
            for (let hour = 0; hour < 24; hour++) {
                // Create div value
                const divValue = document.createElement('div');
                divValue.setAttribute('value', hour.toString());
                divValue.innerText = hour.toString() + 'h';

                // Add to select element
                hourSelectElement.appendChild(divValue);
            }

            // Set hour value
            hourSelectElement.value = hour.toString();

            // Create minute select element
            const minuteSelectElement = document.createElement('ui-select');
            minuteSelectElement.setAttribute('data-minute-index', index.toString());

            // Create inner minute elements
            for (let minute = 0; minute < 60; minute += 5) {
                // Create div value
                const divValue = document.createElement('div');
                divValue.setAttribute('value', minute.toString());
                divValue.innerText = minute.toString() + 'm';

                // Add to select element
                minuteSelectElement.appendChild(divValue);
            }

            // Set minute value
            minuteSelectElement.value = minute.toString();

            // Create delete icon button
            const deleteIconButtonElement = document.createElement('ui-icon-button');
            deleteIconButtonElement.setAttribute('blank', '');
            deleteIconButtonElement.setAttribute('danger', '');
            deleteIconButtonElement.setAttribute('data-delete-index', index.toString());

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

        // If hit limit
        if (StandUpData.fixedStandList.length >= 10) return;

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

        // Add event
        this._addStandTimeButtonElement.addEventListener('click', this._addStandTimeButtonClickEvent);
    }

    /**
     * Reset the fixed stand data.
     */
    _resetAndSave() {
        // If showing flag is set then do nothing
        if (this._showingFlag === true) return;

        // Reset the control
        StandUpControl.reset();

        // Save settings
        StandUpData.save();
    }
}

// Create the UI element
UiTools.createUi(StandUpSettings, 'stand-up-settings', import.meta.url);
