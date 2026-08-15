/**
 * Stand up data
 */

export class StandUpData {
    /**
     * Timer Type (0=Switch between sit/stand, 1=Fixed trigger times)
     */
    static timerType = 0;

    /**
     * Sit time (the amount of time to be sitting at your desk, in minutes)
     */
    static sitTime = 30;

    /**
     * Stand time (the amount of time to be standing up, in minutes)
     */
    static standTime = 3;

    /**
     * Start standing (when using timer type switch)
     */
    static startStanding = false;

    /**
     * Fixed stand list (date objects with time parts set to when you should stand)
     */
    static fixedStandList = [];

    /**
     * Use system notifications (should the OS show notifications?)
     */
    static useSystemNotifications = true;

    /**
     * Use page notifications (should the notifications be shown within the page?)
     */
    static usePageNotifications = true;

    /**
     * Theme
     */
    static theme = 'theme-light';

    /**
     * Paused (is the timer paused or running)
     */
    static paused = false;

    /**
     * Current sit (remaining time to sit, in seconds)
     */
    static currentSit = StandUpData.sitTime * 60;

    /**
     * Current stand (remaining time to stand, in seconds)
     */
    static currentStand = StandUpData.standTime * 60;

    /**
     * Standing (are you standing or sitting?)
     */
    static standing = false;

    /**
     * Progress percentage (the length to wait until the next switch)
     */
    static progressPercentage = 0;

    /**
     * Sorted fixed stand list (same as fixed stand list, but sorted)
     */
    static sortedFixedStandList = [];

    /**
     * Use notifications (you can turn them off while in settings)
     */
    static useNotifications = true;

    /**
     * Save the stand up config information.
     */
    static save() {
        // Create object to save the data in
        const data = {};
        data.timerType = StandUpData.timerType;
        data.sitTime = StandUpData.sitTime;
        data.standTime = StandUpData.standTime;
        data.startStanding = StandUpData.startStanding;
        data.useSystemNotifications = StandUpData.useSystemNotifications;
        data.usePageNotifications = StandUpData.usePageNotifications;
        data.theme = StandUpData.theme;

        // Set fixed stand list
        data.fixedStandList = [];
        StandUpData.fixedStandList.forEach((date) => {
            // Add hour minute item
            data.fixedStandList.push({ hour: date.getHours(), minute: date.getMinutes() });
        });

        // Convert into JSON
        const jsonData = JSON.stringify(data);

        // Save to local storage
        localStorage.setItem('stand-up-config', jsonData);

        // Recreate the sorted fixed stand list
        StandUpData._createSortedFixedStandList();
    }

    /**
     * Save the current state.
     */
    static saveState() {
        // Create object to save the data in
        const data = {};
        data.currentSit = StandUpData.currentSit;
        data.currentStand = StandUpData.currentStand;
        data.standing = StandUpData.standing;
        data.paused = StandUpData.paused;

        // Convert into JSON
        const jsonData = JSON.stringify(data);

        // Save to local storage
        localStorage.setItem('stand-up-config-state', jsonData);
    }

    /**
     * Load the stand up config information.
     */
    static load() {
        // Get JSON data
        const jsonData = localStorage.getItem('stand-up-config');

        // If nothing then skip
        if (!jsonData) return;

        // Convert from JSON into data object
        const data = JSON.parse(jsonData);

        // Check and set config properties
        const undefinedText = 'undefined';
        if (typeof data.timerType !== undefinedText) StandUpData.timerType = data.timerType;
        if (typeof data.sitTime !== undefinedText) StandUpData.sitTime = data.sitTime;
        if (typeof data.standTime !== undefinedText) StandUpData.standTime = data.standTime;
        if (typeof data.startStanding !== undefinedText) StandUpData.startStanding = data.startStanding;
        if (typeof data.useSystemNotifications !== undefinedText) StandUpData.useSystemNotifications = data.useSystemNotifications;
        if (typeof data.usePageNotifications !== undefinedText) StandUpData.usePageNotifications = data.usePageNotifications;
        if (typeof data.theme !== undefinedText) StandUpData.theme = data.theme;
        if (typeof data.paused !== undefinedText) StandUpData.paused = data.paused;
        if (typeof data.currentSit !== undefinedText) StandUpData.currentSit = data.currentSit;
        if (typeof data.currentStand !== undefinedText) StandUpData.currentStand = data.currentStand;
        if (typeof data.standing !== undefinedText) StandUpData.standing = data.standing;

        // Set fixed stand list
        StandUpData.fixedStandList = [];
        if (typeof data.fixedStandList !== undefinedText) {
            // For each hour/minute item
            data.fixedStandList.forEach((item) => {
                // Add date object to list
                StandUpData.fixedStandList.push(new Date(2000, 0, 1, item.hour, item.minute));
            });
        }

        // Create the sorted fixed stand list
        StandUpData._createSortedFixedStandList();
    }

    /**
     * Load the current state.
     */
    static loadState() {
        // Get JSON data
        const jsonData = localStorage.getItem('stand-up-config-state');

        // If nothing then skip
        if (!jsonData) return;

        // Convert from JSON into data object
        const data = JSON.parse(jsonData);

        // Check and set config properties
        const undefinedText = 'undefined';
        if (typeof data.currentSit !== undefinedText) StandUpData.currentSit = data.currentSit;
        if (typeof data.currentStand !== undefinedText) StandUpData.currentStand = data.currentStand;
        if (typeof data.standing !== undefinedText) StandUpData.standing = data.standing;
        if (typeof data.paused !== undefinedText) StandUpData.paused = data.paused;
    }

    /**
     * Create the sorted fixed stand list.
     */
    static _createSortedFixedStandList() {
        // Clear the list
        StandUpData.sortedFixedStandList = [];

        // For each fixed stand item
        StandUpData.fixedStandList.forEach((date) => {
            // Add to sorted list
            StandUpData.sortedFixedStandList.push(date);
        });

        // Now sort the list
        StandUpData.sortedFixedStandList.sort((time1, time2) => {
            // Get hours
            const hour1 = time1.getHours();
            const hour2 = time2.getHours();

            // Compare hours
            if (hour1 > hour2) return 1;
            if (hour1 < hour2) return -1;

            // Otherwise the same, get minutes
            const minute1 = time1.getMinutes();
            const minute2 = time2.getMinutes();

            // Compare minutes
            if (minute1 > minute2) return 1;
            if (minute1 < minute2) return -1;

            // Return the same
            return 0;
        });
    }
}