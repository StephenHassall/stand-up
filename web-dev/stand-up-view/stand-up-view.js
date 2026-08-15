/**
 * Stand Up View
 */
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";
import "/node_modules/@coderundebug/ui-web/ui-button.js";
import { StandUpControl } from "../stand-up-control.js";
import { StandUpData } from "../stand-up-data.js";

export class StandUpView extends HTMLElement {
    /**
     * Stand up view constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = StandUpView.uiHtml;

        // Add CSS style sheet
        this.shadowRoot.adoptedStyleSheets = [StandUpView.uiCssStyleSheet];

        // Get elements
        this._baseElement = this.shadowRoot.querySelector('.base');
        this._statusElement = this.shadowRoot.getElementById('status');
        this._timeBlockElement = this.shadowRoot.querySelector('.time');
        this._hourElement = this.shadowRoot.getElementById('hour');
        this._minuteElement = this.shadowRoot.getElementById('minute');
        this._secondElement = this.shadowRoot.getElementById('second');
        this._switchButtons = this.shadowRoot.getElementById('switch-buttons');
        this._pauseResumeElement = this.shadowRoot.getElementById('pause-resume');
        this._resetElement = this.shadowRoot.getElementById('reset');
        this._progressElement = this.shadowRoot.getElementById('progress');
        this._progressDoneElement = this.shadowRoot.getElementById('progress-done');

        // Bind functions
        this._tickEvent = this._tickEvent.bind(this);
        this._switchEvent = this._switchEvent.bind(this);
        this._pauseResumeClickEvent = this._pauseResumeClickEvent.bind(this);
        this._resetClickEvent = this._resetClickEvent.bind(this);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._pauseResumeElement.addEventListener('click', this._pauseResumeClickEvent);
        this._resetElement.addEventListener('click', this._resetClickEvent);
        StandUpControl.addEventListener('tick', this._tickEvent);
        StandUpControl.addEventListener('switch', this._switchEvent);

        // Update the switch buttons
        this._updateSwitchButtons();

        // Set elements before the tick
        this._hourElement.innerText = '00';
        this._minuteElement.innerText = '00';
        this._secondElement.innerText = '00';
        this._timeBlockElement.setAttribute('no-hour', '');
        this._progressDoneElement.style.width = '0%';
        this._statusElement.innerText = '---';

        // Set status flag
        this._setStatus = true;
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._pauseResumeElement.removeEventListener('click', this._pauseResumeClickEvent);
        this._resetElement.removeEventListener('click', this._resetClickEvent);
        StandUpControl.removeEventListener('tick', this._tickEvent);
        StandUpControl.removeEventListener('switch', this._switchEvent);
    }

    /**
     * Data updated. Call this when the settings have changed the data.
     */
    dataUpdated() {
        // Update the switch buttons
        this._updateSwitchButtons();

        // Update timer
        this._updateTimer();

        // Update progress
        this._updateProgress();

        // Update status for the first time
        this._updateStatus();
    }

    /**
     * Pause and resume click event.
     */
    _pauseResumeClickEvent() {
        // Switch between pause and resume
        if (StandUpData.paused === false) StandUpData.paused = true; else StandUpData.paused = false;

        // Update the pause resume HTML
        if (StandUpData.paused === false) {
            this._pauseResumeElement.innerHTML = 'Pause';
        } else {
            this._pauseResumeElement.innerHTML = 'Resume';
        }
    }

    /**
     * Reset click event.
     */
    _resetClickEvent() {
        // If standing
        if (StandUpData.standing === true) {
            // Reset the current standing timer (in seconds)
            StandUpData.currentStand = StandUpData.standTime * 60;
        }

        // Else sitting
        else {
            // Reset the current setting timer (in seconds)
            StandUpData.currentSit = StandUpData.sitTime * 60;
        }

        // Reset progress percentage
        StandUpData.progressPercentage = 0;

        // Update timer
        this._updateTimer();

        // Update progress
        this._updateProgress();
    }

    /**
     * Tick event.
     */
    _tickEvent() {
        // Update timer
        this._updateTimer();

        // Update progress
        this._updateProgress();

        // If we need to set the status for the first time
        if (this._setStatus === true) {
            // Reset status flag
            this._setStatus = false;

            // Update status for the first time
            this._updateStatus();
        }
    }

    /**
     * Switch event.
     */
    _switchEvent() {
        // Update the status
        this._updateStatus();

        // Update timer
        this._updateTimer();

        // Update progress
        this._updateProgress();
    }

    /**
     * Update switch buttons.
     */
    _updateSwitchButtons() {
        // If timer type is fixed
        if (StandUpData.timerType === 1) {
            // Hide the switch buttons
            this._switchButtons.style.display = 'none';
        } else {
            // Show the switch buttons
            this._switchButtons.style.display = 'grid';
        }
    }

    /**
     * Update the timer.
     */
    _updateTimer() {
        // Set current time
        let currentTime = 0;
        if (StandUpData.standing === true) currentTime = StandUpData.currentStand; else currentTime = StandUpData.currentSit;

        // Set hour, minute and second
        const hour = Math.floor(currentTime / (60 * 60));
        currentTime = currentTime - (hour * 60 * 60);
        const minute = Math.floor(currentTime / 60);
        currentTime = currentTime - (minute * 60);
        const second = currentTime;

        // Set hour, minute and second text
        const hourText = hour.toString().padStart(2, '0');
        const minuteText = minute.toString().padStart(2, '0');
        const secondText = second.toString().padStart(2, '0');

        // Set elements
        this._hourElement.innerText = hourText;
        this._minuteElement.innerText = minuteText;
        this._secondElement.innerText = secondText;

        // If no hours
        if (hour === 0) {
            // Add no-hour attribute to time element
            this._timeBlockElement.setAttribute('no-hour', '');
        } else {
            // Remove any existing no-hour attribute
            this._timeBlockElement.removeAttribute('no-hour');
        }
    }

    /**
     * Update the status.
     */
    _updateStatus() {
        // Set status
        if (StandUpData.standing === true) this._statusElement.innerText = 'STANDING UP';
        if (StandUpData.standing === false) this._statusElement.innerText = 'SITTING DOWN';
    }

    /**
     * Update progress.
     */
    _updateProgress() {
        // Reset the width of the progress done element
        this._progressDoneElement.style.width = StandUpData.progressPercentage.toString() + '%';
    }
}

// Create the UI element
UiTools.createUi(StandUpView, 'stand-up-view', import.meta.url);
