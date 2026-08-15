# Stand Up

> [Live preview](https://standuphelper.netlify.app)

Nothing really helps you understand something more than a good example. In this project I will show you the tools and methods I use to create a simple web site. It focuses on how to use the ui-web library to build easy to understand and manage JavaScript, HTML and CSS code. Keeping away from frameworks like React, Angular, Vue, and other tools like TypeScript, and SCSS, but instead using only standard vanilla JavaScript, HTML and CSS, to keep things small and simple.

Do we really need frameworks any more? Yes probably, but I want to show you that it is possible to create a web site without them. Stay with me while I go through the steps I use to build a project that you hopefully find useful.

This project is used to remind people to stand up. Some of us spend way too much time sitting at our desks, only to feel the pain later on in life. This web site will count down the time you have been sitting, then notifies you to stand up, waits a bit, and then tells you to sit back down again. This repeats throughout the day, keeping you moving every now and then.

## Web Components

There are three main layers to a web page, JavaScript, HTML and CSS. Keeping these different things in their own files is better than putting them altogether inside some messy JavaScript file. I’m a big fan of web components and I use them everywhere, but even these sometimes include everything in one large hard to edit source file. This was one of the reasons why I built the `ui-web` library. It allows you to build web components and keep all the files separate.

Take a look at the source folder `stand-up-view`. Inside it contains a CSS, HTML and JavaScript file. It is easier to edit each HTML and CSS separately instead of editing the details inside a string variable. These files are put together to create a web component. The tag will be `<stand-up-view>` and the HTML file will be used inside, with the CSS styling. Let's see what the code looks like.

```javascript
import { UiTools } from "/node_modules/@coderundebug/ui-web/ui-tools.js";

export class StandUpView extends HTMLElement {
   constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = StandUpView.uiHtml;

        // Add CSS style sheet
        this.shadowRoot.adoptedStyleSheets = [StandUpView.uiCssStyleSheet];
    }
}

// Create the UI element
UiTools.createUi(StandUpView, 'stand-up-view', import.meta.url);
```

The whole thing works just like any normal web component. The `UiTools.createUi` function is not only creating the custom element, but is also loading in the HTML and CSS files and storing them into static properties (`uiCssStyleSheet` and `uiHtml`). Then each time the web component is used, a new instance of the web component is created, and inside the constructor we use those static properties to set the shadow root’s inner HTML and set its styling.

The web component is reusing the same loaded HTML data and CSS style sheet. The files are not reloaded each time the web component is used. Editing the HTML or CSS in their own files allows Visual Studio Code (or any other IDE) to give hints and other tools to make it similar to work with. Trying to edit HTML and CSS within a JavaScript file can be a pain.

## web-dev / web-live

When developing a web site I want to be able to debug the JavaScript code. I do this within Chrome’s DevTools. But I need to make sure the code reaching the browser is the same as the code I am seeing in my development tools. When the web site is deployed, I do not want the user to be able to see all my source code, I want it minified and obfuscated.

To handle this I create two folders, one for all the development work (`web-dev`), and another for deployment/production (`web-live`). All the files in `web-dev` are part of the git repository, but the `web-live` files are built, created from the `web-dev` folder, and therefore are not saved in the repository. The work flow is to develop the web site and store everything inside the `web-dev` folder. Then I perform the build process, which copies and minifies files from `web-dev` into `web-live`. The final step is to deploy everything inside the `web-live` folder.

There are two small express web server Node JS applications that each use either the `web-dev` or `web-live` folders. This allows you to see the web site up and running within a browser on your local machine.

One of the biggest benefits to doing things this way, is the speed of seeing changes you make showing up in the browser. Change any of the files, HTML, CSS or JavaScript, then refresh the page in the browser, and there it is. There are no additional steps required, no build process, no TypeScript or React compiling, nothing.

## build

The build process takes `web-dev` files and makes them ready for the live deployment. Some files only need copying. Some CSS files can be minified a little, and some non-web component JavaScript files can be minified and obfuscated. Only the files needed for the live (production) web site are needed.

Web components that use the `UiTools.createUi` function, that have separate HTML, CSS and JavaScript files, can be built differently. Having the HTML and CSS files fetched over the internet before the web component can be used is going to take the whole site longer to load up and get going. Instead, the build process combines the HTML and CSS text into the final JavaScript file, so only the JavaScript file is needed, and only that is fetched. The end result looks something like this.

```javascript
/* By Stephen Paul Hassall (web: https://coderundebug.com) */
// > minified obfuscated code
export class StandUpView extends HTMLElement...
StandUpView.uiCss='...CSS...';
StandUpView.uiHtml='...HTML...';
UiTools.createUi(StandUpView,"stand-up-view",import.meta.url);
```

It starts off with a header comment, followed by the body of the web component minified and obfuscated. After this is the CSS and HTML text, stored in static properties, which will be used when the web component is created. At the end is the same `UiTools.createUi` function call. The final JavaScript file contains everything that was inside the original HTML, CSS and JavaScript files, all minified and obfuscated and ready for the production web site.

## test

I try to write great code, but no matter how hard or how careful I am, there are always going to be problems. Some code needs help. You just know it isn’t going to work the first time, it's too complex, you can’t hold it all in your mind and understand every part perfectly. Sometimes there is just no getting around it, you need to create some unit tests, you need to create more code to test the first code.

I keep all my unit tests inside the test folder. I create the tests, but I run each one on their own, commenting out all the others. I don’t use any testing framework, because I like to debug the tests. I don’t just want to know if they pass or not, I want to be able to go inside and see what is broken when things fail.

Testing functions can be a little hacky. The tests set up the code in a way that they may not have been designed for. They call private functions, set up event listeners in odd ways, and set global properties as not intended. But it is all done to test each of the more complex functions that need checking. They are also an excellent way of verifying functions work as designed.

## Project

Creating a project from nothing is like looking up at a mountain you are about to climb. It seems impossible to start with. But slowly, one step at a time, one file at a time, a function here, a web component there, it starts to take shape. This is a small project which had some interesting challenges, and it was fun to create. Below is a list of all the files in the project and what they are for.

### stand-up-app, index.html
This is the main application. It is the only web component shown in the index.html file. Its job is to show and hide the other stand up web components. If the user visits the web site for the first time they are shown the stand up welcome web component. After this they are shown the stand up view web component, and if they user presses the settings icon, it shows the stand up settings web component.

### stand-up-welcome
If the system notifications state is still unknown, then the user is shown a welcome message. This is used to encourage the user to turn notifications on. If they do not then they can not continue on. It also stops the application being used on phones, as system notifications do not work as required, stopping it from working.

### stand-up-view
This is the main web component that will be shown most of the time. It shows a timer until the next event will occur. Depending on the timer type, you can pause and reset the timer.

### stand-up-settings
When the user presses the settings icon, they will be shown this web component. It allows the user to make adjustments to different configuration data.

### info-page, info.html
This shows the about and legal information. Not very exciting.

### stand-up-data.js
This contains all the settings and state information. All the data is stored in static properties. There are functions to save and load both the settings configuration, and the current state data. Data is stored in the browser’s local storage area.

### stand-up-control.js
This is the engine of the whole application. It takes the stand up data and every second it works out if a notification needs to be shown, either to stand up or sit back down. It performs all the complex calculations required, updating the progress percentage, and triggering tick and switch events.

### system-notifications.js
This is used to handle everything relating to system notifications. It gets the current state, asks for permission, and also triggers notification messages.

### page-notifications.js
Alert messages can also be shown within the page. These notifications are only seen on the page. They may not be all that useful however.

### theme-dark.css, theme-light.css, theme-mono.css, theme-serif.css
These are different themes that change the styling used.

### web-site.js
A very small and simple web component that is used to show the current web site address as text.

### favicon.svg
The web site’s favorite icon which is shown in the browser’s tab.

