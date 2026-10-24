/**
 * Timer worker
 * 
 * This is used because PWA install, when minimized, stops the setInterval events
 * from firing, but this timer worker stays alive.
 */

// Set timer for every half second
setInterval(() => {
    // Post a tick message
    self.postMessage('TICK');
}, 500);