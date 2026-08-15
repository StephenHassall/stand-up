/**
 * Page Notification
 */
import { StandUpControl } from "./stand-up-control.js";
import { StandUpData } from "./stand-up-data.js";
import UiToast from "/node_modules/@coderundebug/ui-web/ui-toast.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-arrow-up.js";
import "/node_modules/@coderundebug/ui-web/icon/ui-icon-arrow-down.js";

export class PageNotification {
    /**
     * Initialize the page notification module.
     */
    static initialize() {
        // Add switch event
        StandUpControl.addEventListener('switch', PageNotification._switchEvent);
    }

    /**
     * Switch event.
     */
    static _switchEvent() {
        // If currently not using notifications (maybe we are settings)
        if (StandUpData.useNotifications === false) return;
        
        // If not used
        if (StandUpData.usePageNotifications === false) return;

        // If switching to standing up
        if (StandUpData.standing === true) {
            // Show toast alert
            UiToast.addAlert(
                'success',
                'STAND UP',
                'It\'s time to stand up.',
                'ui-icon-arrow-up'
            );
        }

        // If switching to sitting down
        if (StandUpData.standing === false) {
            // Show toast alert
            UiToast.addAlert(
                'default',
                'SIT DOWN',
                'It\'s time to sit back down.',
                'ui-icon-arrow-down',
                false,
                5000,
                UiToast.LOCATION_TOP_CENTER
            );
        }
    }   
}