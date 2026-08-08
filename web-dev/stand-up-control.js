/**
 * Stand up control
 */
import { StandUpData } from "./stand-up-data.js";

export class StandUpControl {
    /**
     * Event listener list.
     */
    static _eventListenerList = [];

    /**
     * The current timer second.
     */
    static _timerSecond = -1;

    /**
     * Seconds in day
     */
    static _secondsInDay = 24 * 60 * 60;

    /**
     * Initialize the stand up control module.
     */
    static initialize() {
        // Start the timer
        setInterval(StandUpControl._timerEvent, 250);
    }

    /**
     * Add event listener. Whenever the event type happens then the listener callback
     * function will be called.
     * @param {String} type The type of event to listen for.
     * @param {Function} listener The listener function to run when the event happens.
     */
    static addEventListener(type, listener) {
        // Create event listener object
        const eventListener = {};
        eventListener.type = type;
        eventListener.listener = listener;

        // Add to list
        StandUpControl._eventListenerList.push(eventListener);
    }

    /**
     * Remove event listener. Remove the existing event listener.
     * @param {String} type The type of event it was listening for.
     * @param {Function} listener The listener function that was being called.
     */
    static removeEventListener(type, listener) {
        // For each event listener
        for (let index = 0; index < StandUpControl._eventListenerList.length; index++) {
            // Get event listener
            const eventListener = StandUpControl._eventListenerList[index];

            // If not the same type
            if (eventListener.type !== type) continue;

            // If not the same listener
            if (eventListener.listener !== listener) continue;

            // Remove this event listener from the list
            StandUpControl._eventListenerList.splice(index, 1);

            // Found so stop
            return;
        }
    }

    /**
     * Timer event.
     */
    static _timerEvent() {
        // Get date time now
        const now = new Date();

        // Get second
        const second = now.getSeconds();

        // If the same as the current timer second value then nothing has changed
        if (second === StandUpControl._timerSecond) return;

        // Reset the timer second
        StandUpControl._timerSecond = second;

        // If paused then do nothing
        if (StandUpData.paused === true) return;

        // If timer type is switch
        if (StandUpData.timerType === 0) StandUpControl._checkSwitch(now);

        // If time type is fixed
        if (StandUpData.timerType === 1) {
            // Check fixed
            StandUpControl._checkFixed(now);

            // Workout the progress percentage
            StandUpControl._workoutProgressPercentage(now);
        }
    }

    /**
     * Check for switch changes.
     */
    static _checkSwitch() {
        // If not standing
        if (StandUpData.standing === false) {
            // Decrease the current sit time
            StandUpData.currentSit--;

            // Adjust the progress percentage value
            StandUpData.progressPercentage = 100 - (StandUpData.currentSit / (StandUpData.sitTime * 60) * 100);

            // Fire tick event
            StandUpControl._fireEvent('tick');

            // If not now zero then we can stop here
            if (StandUpData.currentSit !== 0) return;

            // Switch from sitting to standing
            StandUpData.standing = true;

            // Reset current times
            StandUpData.currentSit = StandUpData.sitTime * 60;
            StandUpData.currentStand = StandUpData.standTime * 60;

            // Reset the progress percentage value
            StandUpData.progressPercentage = 0;

            // Fire switch
            StandUpControl._fireEvent('switch');

            // Stop here
            return;
        }

        // If standing
        if (StandUpData.standing === true) {
            // Decrease the current stand time
            StandUpData.currentStand--;

            // Adjust the progress percentage value
            StandUpData.progressPercentage = 100 - (StandUpData.currentStand / (StandUpData.standTime * 60) * 100);

            // Fire tick event
            StandUpControl._fireEvent('tick');

            // If not now zero then we can stop here
            if (StandUpData.currentStand !== 0) return;

            // Switch from standing to sitting
            StandUpData.standing = false;

            // Reset current times
            StandUpData.currentSit = StandUpData.sitTime * 60;
            StandUpData.currentStand = StandUpData.standTime * 60;

            // Reset the progress percentage value
            StandUpData.progressPercentage = 0;

            // Fire switch
            StandUpControl._fireEvent('switch');
        }
    }

    /**
     * Check fixed changes.
     * @param {Date} now The date and time now to check against.
     */
    static _checkFixed(now) {
        // If no fixed stand list
        if (StandUpData.fixedStandList.length === 0) return;

        // Get now hour, minute and second
        const nowHour = now.getHours();
        const nowMinute = now.getMinutes();
        const nowSecond = now.getSeconds();

        // Set now total seconds
        const nowTotalSecond = (nowHour * 60 * 60) + (nowMinute * 60) + nowSecond;

        // Get fixed stand
        let fixedStand = null;

        // Set hour, minute and second
        let hour = 0;
        let minute = 0;
        let second = 0;

        // Set total seconds
        let totalSecond = 0;

        // Set found index
        let foundIndex = -1;

        // For each fixed stand time (this list is sorted)
        for (let index = 0; index < StandUpData.fixedStandList.length; index++) {
            // Get fixed stand
            fixedStand = StandUpData.fixedStandList[index];

            // Get hour, minute and second
            hour = fixedStand.getHours();
            minute = fixedStand.getMinutes();
            second = fixedStand.getSeconds();

            // Set total seconds
            totalSecond = (hour * 60 * 60) + (minute * 60) + second;

            // If now time is after this fixed time (it is in the past)
            if (nowTotalSecond > totalSecond + (StandUpData.standTime * 60)) continue;

            // This is in the future, and because the list is sorted, we can say this
            // is either the next fixed stand event or we are inside the current fixed stand
            foundIndex = index;
            break;
        }

        // If nothing found then we are at the end of the day
        if (foundIndex === -1) {
            // Cycle back to the first
            fixedStand = StandUpData.fixedStandList[0];

            // Get hour, minute and second
            hour = fixedStand.getHours();
            minute = fixedStand.getMinutes();
            second = fixedStand.getSeconds();

            // Set total seconds
            totalSecond = (hour * 60 * 60) + (minute * 60) + second;

            // Set last fixed stand (which was the last one)
            const lastFixedStand = StandUpData.fixedStandList[StandUpData.fixedStandList.length - 1];

            // If currently standing
            if (StandUpData.standing === true) {
                // Set to sitting
                StandUpData.standing = false;

                // Reset current times
                StandUpData.currentSit = totalSecond + (24 * 60 * 60) - nowTotalSecond;

                // Fire tick and switch events
                StandUpControl._fireEvent('tick');
                StandUpControl._fireEvent('switch');
            }

            // Else currently sitting
            else {
                // Reset current times
                StandUpData.currentSit = totalSecond + (24 * 60 * 60) - nowTotalSecond;

                // Fire tick events
                StandUpControl._fireEvent('tick');
            }

            // Stop here
            return;
        }

        // Get the previous fixed stand
        let previousFixedStand = null;
        if (foundIndex !== 0) {
            // Get the one before the found index
            previousFixedStand = StandUpData.fixedStandList[foundIndex - 1];
        } else {
            // The found one was the first in the list, therefore get the last one
            previousFixedStand = StandUpData.fixedStandList[StandUpData.fixedStandList.length - 1];
        }

        // If currently standing
        if (StandUpData.standing === true) {
            // If still inside
            if (nowTotalSecond >= totalSecond) {
                // Adjust the current
                StandUpData.currentStand = (StandUpData.standTime * 60) - (nowTotalSecond - totalSecond);

                // Fire tick event
                StandUpControl._fireEvent('tick');
            }

            // Else we are now sitting
            else {
                // Switch to sit
                StandUpData.standing = false;

                // Reset current times
                StandUpData.currentSit = totalSecond - nowTotalSecond;

                // Fire tick and switch events
                StandUpControl._fireEvent('tick');
                StandUpControl._fireEvent('switch');
            }
        }

        // Else currently sitting
        else {
            // If now inside
            if (nowTotalSecond >= totalSecond) {
                // Switch to stand
                StandUpData.standing = true;

                // Reset current times
                StandUpData.currentStand = totalSecond - nowTotalSecond;

                // Fire tick and switch events
                StandUpControl._fireEvent('tick');
                StandUpControl._fireEvent('switch');
            }

            // Else we are now sitting
            else {
                // Adjust the current
                StandUpData.currentSit = totalSecond - nowTotalSecond;

                // Fire tick event
                StandUpControl._fireEvent('tick');
            }
        }
    }

    /**
     * Workout the progress percentage for the current state.
     * @param {Date} now The date and time now to check against.
     */
    static _workoutProgressPercentage(now) {
        // If timer type is switch
        if (StandUpData.timerType === 0) {
            // If not standing
            if (StandUpData.standing === false) {
                // Set the progress percentage value
                StandUpData.progressPercentage = 100 - (StandUpData.currentSit / (StandUpData.sitTime * 60) * 100);
            }

            // If standard
            if (StandUpData.standing === true) {
                // Set the progress percentage value
                StandUpData.progressPercentage = 100 - (StandUpData.currentStand / (StandUpData.standTime * 60) * 100);
            }

            // We can stop here
            return;
        }

        // At this point the timer type is fixed. There are some different states that we need
        // to look for. We are looking at things from 00:00:00 to 23:59:59 time line.
        // 
        // 1) We are inside one if the a fixed stand.
        // 2) There is only one fixed stand.
        // 3) We have not reached the first fixed stand yet (therefore progress starts from the last one).
        // 4) We have gone passed the last fixed stand (therefore progress ends on the first one).
        // 5) We are between two fixed stands.

        // Reset default progress percentage value
        StandUpData.progressPercentage = 0;

        // Set stand time seconds
        const standTimeSecond = StandUpData.standTime * 60;

        // If no fixed stand list exists then we can do nothing
        if (StandUpData.fixedStandList.length === 0) return;

        // Get now hour, minute and second
        const nowHour = now.getHours();
        const nowMinute = now.getMinutes();
        const nowSecond = now.getSeconds();

        // Set now total seconds
        const nowTotalSecond = (nowHour * 60 * 60) + (nowMinute * 60) + nowSecond;

        // The first check we need to make is to see if we are currently inside/standing

        // For each fixed stand time (this list is sorted)
        for (let index = 0; index < StandUpData.fixedStandList.length; index++) {
            // Get fixed stand
            const fixedStand = StandUpData.fixedStandList[index];

            // Get hour, minute and second
            const hour = fixedStand.getHours();
            const minute = fixedStand.getMinutes();
            const second = fixedStand.getSeconds();

            // Set total seconds
            const totalSecond = (hour * 60 * 60) + (minute * 60) + second;

            // If before
            if (nowTotalSecond < totalSecond) continue;

            // If after
            if (nowTotalSecond >= totalSecond + standTimeSecond) continue;

            // We must be inside/standing

            // Set the progress percentage value
            StandUpData.progressPercentage = (nowTotalSecond - totalSecond) / standTimeSecond * 100;

            // Stop here
            return;
        }

        // Get the first and the last fixed stands
        const firstFixedStand = StandUpData.fixedStandList[0];
        const lastFixedStand = StandUpData.fixedStandList[StandUpData.fixedStandList.length - 1];

        // Set hour, minute, second for first and last fixed stand
        const firstHour = firstFixedStand.getHours();
        const firstMinute = firstFixedStand.getMinutes();
        const firstSecond = firstFixedStand.getSeconds();
        const lastHour = lastFixedStand.getHours();
        const lastMinute = lastFixedStand.getMinutes();
        const lastSecond = lastFixedStand.getSeconds();

        // Set total seconds for both
        const firstTotalSeconds = (firstHour * 60 * 60) + (firstMinute * 60) + firstSecond;
        const lastTotalSeconds = (lastHour * 60 * 60) + (lastMinute * 60) + lastSecond;

        // If there is only one fixed stand
        if (StandUpData.fixedStandList.length === 1) {
            // If inside
            if (nowTotalSecond > firstTotalSeconds &&
                nowTotalSecond < firstTotalSeconds + StandUpData.standTime) {
                // Set the progress percentage value
                StandUpData.progressPercentage = (nowTotalSecond - firstTotalSeconds) / standTimeSecond * 100;
            }

            // Else outside
            else {
                // Set total sit time (total wait time is 24hours - stand time)
                const totalSitTime = StandUpControl._secondsInDay - standTimeSecond;

                // Set done time
                let doneTime = 0;

                // If before
                if (nowTotalSecond < firstTotalSeconds) {
                    // Set the done time
                    doneTime = StandUpControl._secondsInDay - (firstTotalSeconds + standTimeSecond) + nowTotalSecond;
                }

                // Else after
                else {
                    // Set the done time
                    doneTime = nowTotalSecond - (firstTotalSeconds + standTimeSecond);
                }

                // Set the progress percentage value
                StandUpData.progressPercentage = doneTime / totalSitTime * 100;
            }

            // Stop here
            return;
        }

        // If we have not yet reached the first fixed stand
        if (nowTotalSecond < firstTotalSeconds) {
            // We must be outside/sitting

            // Set total sit time (from the last fixed + up to the first fixed)
            const totalSitTime = StandUpControl._secondsInDay - (lastTotalSeconds + standTimeSecond) + firstTotalSeconds;

            // Set done time
            const doneTime = StandUpControl._secondsInDay - (lastTotalSeconds + standTimeSecond) + nowTotalSecond;

            // Set the progress percentage value
            StandUpData.progressPercentage = doneTime / totalSitTime * 100;

            // Stop here
            return;
        }

        // If we have past the last fixed stand
        if (nowTotalSecond > lastTotalSeconds + standTimeSecond) {
            // We must be outside/sitting

            // Set total sit time (from the last fixed + up to the first fixed)
            const totalSitTime = StandUpControl._secondsInDay - (lastTotalSeconds + standTimeSecond) + firstTotalSeconds;

            // Set done time
            const doneTime = nowTotalSecond - (lastTotalSeconds + standTimeSecond);

            // Set the progress percentage value
            StandUpData.progressPercentage = doneTime / totalSitTime * 100;

            // Stop here
            return;
        }

        // If we got here then we are still between first and last, but not inside/standing a fixed stand item.
        // We now need to find the fixed stand before and after the current time.

        // Set before and after fixed stands
        let beforeFixedStand = null;
        let afterFixedStand = null;

        // For each fixed stand time (this list is sorted)
        for (let index = 0; index < StandUpData.fixedStandList.length; index++) {
            // Get fixed stand
            const fixedStand = StandUpData.fixedStandList[index];

            // Get hour, minute and second
            const hour = fixedStand.getHours();
            const minute = fixedStand.getMinutes();
            const second = fixedStand.getSeconds();

            // Set total seconds
            const totalSecond = (hour * 60 * 60) + (minute * 60) + second;

            // If before
            if (nowTotalSecond > totalSecond) {
                // Update the before fixed stand
                beforeFixedStand = fixedStand;
                continue;
            }

            // If after
            if (nowTotalSecond < totalSecond) {
                // We only want to use the first fixed stand we find
                afterFixedStand = fixedStand;
                break;
            }
        }

        // If something is wrong
        if (beforeFixedStand === null || afterFixedStand === null) return;

        // Set hour, minute, second for before and after fixed stand
        const beforeHour = beforeFixedStand.getHours();
        const beforeMinute = beforeFixedStand.getMinutes();
        const beforeSecond = beforeFixedStand.getSeconds();
        const afterHour = afterFixedStand.getHours();
        const afterMinute = afterFixedStand.getMinutes();
        const afterSecond = afterFixedStand.getSeconds();

        // Set total seconds for both
        const beforeTotalSeconds = (beforeHour * 60 * 60) + (beforeMinute * 60) + beforeSecond;
        const afterTotalSeconds = (afterHour * 60 * 60) + (afterMinute * 60) + afterSecond;

        // Set total sit time
        const totalSitTime = afterTotalSeconds - beforeTotalSeconds - standTimeSecond;

        // Set done time
        const doneTime = nowTotalSecond - beforeTotalSeconds - standTimeSecond;

        // Set the progress percentage value
        StandUpData.progressPercentage = doneTime / totalSitTime * 100;
    }

    /**
     * Fire the given event.
     * @param {String} type The type of event to fire.
     */
    static _fireEvent(type) {
        // For each event listener
        for (let index = 0; index < StandUpControl._eventListenerList.length; index++) {
            // Get event listener
            const eventListener = StandUpControl._eventListenerList[index];

            // If not the same type
            if (eventListener.type !== type) continue;

            // Call the listener function
            eventListener.listener();
        }
    }
}