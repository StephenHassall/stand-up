/**
 * Service worker.
 */

class SW {
    /**
     * Cache name (with date)
     */
    static _CACHE_NAME = 'standup-20261024c';

    /**
     * Initialize the service worker.
     */
    static initialize() {
        // Add service worker events
        self.addEventListener('install', SW._install);
        self.addEventListener('activate', SW._activate);
        self.addEventListener('fetch', SW._fetch);
        self.addEventListener('message', SW._message);
    }

    /**
     * Install event of the service worker.
     * @param {Object} event Information about the event.
     */
    static _install(event) {
        // Do not let existing tabs use the old version
        self.skipWaiting();
    }

    /**
     * Activate event of the service worker.
     * @param {Object} event Information about the event.
     */
    static _activate(event) {
        // Delete old cache
        const promise = SW._deleteOldCache();

        // Wait until things have finished
        event.waitUntil(promise);
    }

    /**
     * Fetch event of the service worker.
     * @param {Object} event Information about the event.
     */
    static _fetch(event) {
        // If not GET then skip
        if (event.request.method !== 'GET') return;

        // Create URL
        const url = new URL(event.request.url);

        // If search mode is used
        if (url.searchParams.get('mode') === 'app') {
            // Also get this page, do not get the cache
            event.respondWith(
                fetch(event.request)
                .catch(() => {
                    // If the network fails (offline), fall back to the cached homepage
                    // 'ignoreSearch: true' strips away '?mode=app' so it matches the cached '/'
                    return caches.match(event.request, { ignoreSearch: true });
                })
            );

            // Stop here
            return;
        }

        // Get the request (either from cache or by fetching it)
        const promise = SW._getRequest(event.request);

        // Respond with the promise
        event.respondWith(promise);
    }

    /**
     * Message event of the service worker.
     * @param {Object} event Information about the event.
     */
    static _message(event) {
        // If no data
        if (!event.data) return;

        // If up
        if (event.data.type === 'UP') {
            // Show notification
            self.registration.showNotification(
                'Stand Up',
                {
                    body: 'It\'s time to stand up.',
                    icon: 'stand-up-icon.png',
                    renotify: true,
                    tag: 'stand-up-notification-up'
                }
            );
        }

        // If down
        if (event.data.type === 'DOWN') {
            // Show notification
            self.registration.showNotification(
                'Sit Down',
                {
                    body: 'It\'s time to sit back down.',
                    icon: 'sit-down-icon.png',
                    renotify: true,
                    tag: 'stand-up-notification-down'
                }
            );
        }
    }

    /**
     * Delete all the old caches from old versions.
     */
    static async _deleteOldCache() {
        // Get list of caches
        const cacheList = await caches.keys();

        // For each cache
        for (let index = 0; index < cacheList.length; index++) {
            // Get cache
            const cache = cacheList[index];

            // If current cache
            if (cache === SW._CACHE_NAME) continue;

            // Delete this old cache
            await caches.delete(cache);
        }
    }

    /**
     * Get the request. Check the cache first. If not found then fetch, and
     * after we have the file, cache it.
     * @param {Object} request The request for the file.
     */
    static async _getRequest(request) {
        // Open cache
        const cache = await caches.open(SW._CACHE_NAME);

        // Check to see if we already have the file
        const cachedResponse = await cache.match(request);

        // If found then just return it
        if (cachedResponse) return cachedResponse;
    
        // Fetch the file
        const response = await fetch(request);

        // Add to the cache for next time
        cache.put(request, response.clone());

        // Return fetched file response
        return response;
    }
}

// Initialize the service worker
SW.initialize();
