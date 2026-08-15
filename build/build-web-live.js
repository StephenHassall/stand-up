/**
 * Build the web-live parts.
 */
import BuildTools from "./build-tools.js";
import Fs from "node:fs";

// Log start of build
console.log('Building...');

// Copy node_module folder
Fs.cpSync('./web-dev/node_modules/@coderundebug/ui-web', './web-live/node_modules/@coderundebug/ui-web', { recursive: true });

// Copy other files over
Fs.cpSync('./web-dev/coderundebug.svg', './web-live/coderundebug.svg');
Fs.cpSync('./web-dev/favicon.svg', './web-live/favicon.svg');
Fs.cpSync('./web-dev/index.html', './web-live/index.html');
Fs.cpSync('./web-dev/info.html', './web-live/info.html');
Fs.cpSync('./web-dev/robots.txt', './web-live/robots.txt');
Fs.cpSync('./web-dev/sit-down-icon.png', './web-live/sit-down-icon.png');
Fs.cpSync('./web-dev/stand-up-icon.png', './web-live/stand-up-icon.png');

// Root
await BuildTools.compressCss('./web-dev/theme-dark.css', './web-live/theme-dark.css');
await BuildTools.compressCss('./web-dev/theme-light.css', './web-live/theme-light.css');
await BuildTools.compressCss('./web-dev/theme-serif.css', './web-live/theme-serif.css');
await BuildTools.compressCss('./web-dev/theme-mono.css', './web-live/theme-mono.css');
await BuildTools.compressJavaScript('./web-dev/page-notification.js', './web-live/page-notification.js');
await BuildTools.compressJavaScript('./web-dev/stand-up-control.js', './web-live/stand-up-control.js');
await BuildTools.compressJavaScript('./web-dev/stand-up-data.js', './web-live/stand-up-data.js');
await BuildTools.compressJavaScript('./web-dev/system-notification.js', './web-live/system-notification.js');
await BuildTools.compressJavaScript('./web-dev/web-site.js', './web-live/web-site.js');

// Info page
Fs.mkdirSync('./web-live/info-page', { recursive: true });
await BuildTools.compressUiWebComponent('./web-dev/info-page/info-page.js', './web-live/info-page/');

// Stand up app
Fs.mkdirSync('./web-live/stand-up-app', { recursive: true });
await BuildTools.compressUiWebComponent('./web-dev/stand-up-app/stand-up-app.js', './web-live/stand-up-app/');

// Stand up settings
Fs.mkdirSync('./web-live/stand-up-settings', { recursive: true });
await BuildTools.compressUiWebComponent('./web-dev/stand-up-settings/stand-up-settings.js', './web-live/stand-up-settings/');

// Stand up view
Fs.mkdirSync('./web-live/stand-up-view', { recursive: true });
await BuildTools.compressUiWebComponent('./web-dev/stand-up-view/stand-up-view.js', './web-live/stand-up-view/');

// Stand up welcome
Fs.mkdirSync('./web-live/stand-up-welcome', { recursive: true });
await BuildTools.compressUiWebComponent('./web-dev/stand-up-welcome/stand-up-welcome.js', './web-live/stand-up-welcome/');

// Log end of build
console.log('Finished');