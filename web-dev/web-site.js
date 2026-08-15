/**
 * Web site
 */

class WebSite extends HTMLElement {
    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Set domain name
        this.textContent = window.location.hostname;
    }
}

// Define the web component
customElements.define('web-site', WebSite);
