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
    //static sitTime = 30;
    static sitTime = 1;

    /**
     * Stand time (the amount of time to be standing up, in minutes)
     */
    //static standTime = 3;
    static standTime = 1;

    /**
     * Fixed stand list (date objects with time parts set to when you should stand)
     */
    //static fixedStandList = [];
    static fixedStandList = [
        new Date(2000,0,1,10,0),
        new Date(2000,0,1,15,15),
        new Date(2000,0,1,20,30)
    ];

    /**
     * Use system notifications (should the OS show notifications?)
     */
    static useSystemNotifications = true;

    /**
     * Use page notifications (should the notifications be shown within the page?)
     */
    static usePageNotifications = true;

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
     * Save the stand up config information.
     */
    static save() {
        // Create object to save the data in
        const data = {};
        data.timerType = StandUpData.timerType;
        data.sitTime = StandUpData.sitTime;
        data.standTime = StandUpData.standTime;
        data.fixedStandList = StandUpData.fixedStandList;
        data.useSystemNotifications = StandUpData.useSystemNotifications;
        data.usePageNotifications = StandUpData.usePageNotifications;
        data.paused = StandUpData.paused;
        data.currentSit = StandUpData.currentSit;
        data.currentStand = StandUpData.currentStand;
        data.standing = StandUpData.standing;

        // Convert into JSON
        const jsonData = JSON.stringify(data);

        // Save to local storage
        localStorage.setItem('stand-up-config', jsonData);
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
        if (typeof data.fixedStandList !== undefinedText) StandUpData.fixedStandList = data.fixedStandList;
        if (typeof data.useSystemNotifications !== undefinedText) StandUpData.useSystemNotifications = data.useSystemNotifications;
        if (typeof data.usePageNotifications !== undefinedText) StandUpData.usePageNotifications = data.usePageNotifications;
        if (typeof data.paused !== undefinedText) StandUpData.paused = data.paused;
        if (typeof data.currentSit !== undefinedText) StandUpData.currentSit = data.currentSit;
        if (typeof data.currentStand !== undefinedText) StandUpData.currentStand = data.currentStand;
        if (typeof data.standing !== undefinedText) StandUpData.standing = data.standing;
    }
}