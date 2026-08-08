/**
 * System Notification
 */
import { StandUpControl } from "./stand-up-control.js";
import { StandUpData } from "./stand-up-data.js";

export class SystemNotification {
    /**
     * Active notification
     */
    static _activeNotification = null;

    /**
     * Initialize the system notification module.
     */
    static initialize() {
        // If there are no notifications on this machine
        if (!('Notification' in window)) return;

        // Add switch event
        StandUpControl.addEventListener('switch', SystemNotification._switchEvent);
    }

    /**
     * Gets the state of the notifications.
     * @return {String} The state value (granted, denied, unknown, unavailable).
     */
    static getState() {
        // If there are no notifications on this machine
        if (!('Notification' in window)) return 'unavailable';

        // Get the current permission
        const currentPermission = Notification.permission;

        // If granted
        if (currentPermission === 'granted') return 'granted';

        // If denied
        if (currentPermission === 'denied') return 'denied';

        // If default
        if (currentPermission === 'default') return 'unknown';

        // Otherwise return unavailable
        return 'unavailable';
    }

    /**
     * Ask for permission.
     * @return {Promise} Returns a promise waiting for the user's response.
     */
    static askForPermission() {
        // If there are no notifications on this machine
        if (!('Notification' in window)) return Promise.reject('unavailable');

        // Return request permission promise
        return Notification.requestPermission();
    }
    
    /**
     * Switch event.
     */
    static _switchEvent() {
        // If not granted
        if (Notification.permission !== 'granted') return;

        // If not used
        if (StandUpData.useSystemNotifications === false) return;

        // If existing 
        if (SystemNotification._activeNotification) {
            // Close the active notification
            SystemNotification._activeNotification.close();
            SystemNotification._activeNotification = null;
        }

        // Set tag
        const tag = 'stand-up-notification_' + Date.now().toString();

        // If switching to standing up
        if (StandUpData.standing === true) {
            // Create the new notification
            SystemNotification._activeNotification = new Notification(
                'Stand Up',
                {
                    body: 'It is time to stand up.',
                    icon: 'stand-up-icon.png',
                    tag: tag
                }
            );
        }

        // If switching to sitting down
        if (StandUpData.standing === false) {
            // Create the new notification
            SystemNotification._activeNotification = new Notification(
                'Sit Down',
                {
                    body: 'It is time to sit back down.',
                    icon: 'sit-down-icon.png',
                    tag: tag
                }
            );
        }
    }
}