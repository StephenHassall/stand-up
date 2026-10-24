/**
 * PWA theme
 */

export class PwaTheme {
    /**
     * Set the PWA color scheme.
     */
    static setPwaColorScheme() {
        // Get ui-theme from local storage
        const uiTheme = localStorage.getItem('ui-theme');

        // If no ui theme then stop here
        if (!uiTheme) return;

        // Get the meta theme-color tags (there should be two)
        const metaTagList = document.querySelectorAll('meta[name="theme-color"]');

        // Set the color to replace
        let color = '#f7f7f7';
        if (uiTheme === '/theme-dark.css') color = '#2e2e2e';
        if (uiTheme === '/theme-light.css') color = '#f7f7f7';
        if (uiTheme === '/theme-mono.css') color = '#272325';
        if (uiTheme === '/theme-serif.css') color = '#fff1e5';

        // For each meta tag
        metaTagList.forEach((metaTag) => {
            // Remove the media attribute so the browser overrides system settings
            metaTag.removeAttribute('media');
            
            // Force tag to match the color
            metaTag.setAttribute('content', color);
        });
    }
}