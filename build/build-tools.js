/**
 * Build tools
 */
import Path from 'node:path';
import { minify } from 'terser';
import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";

export default class BuildTools {
    /**
     * Reg exp parts
     */
    static _cssCommentRegExp = new RegExp('\\/\\*(\\*(?!\\/)|[^*])*\\*\\/', 'g');
    static _htmlCommentRegExp = new RegExp('<!--[^>]*-->', 'g');
    static _multipleSpaceRegExp = new RegExp(' +', 'g');

    /**
     * Signatures
     */
    static _jsSignature = '/* By Stephen Paul Hassall (web: https://coderundebug.com) */';
    static _cssSignature = '/* By Stephen Paul Hassall (web: https://coderundebug.com) */';

    /**
     * Compress a UI web component into a single JavaScript file.
     * @param {String} file The JavaScript file to compress.
     * @param {String} toFolder The location the compressed file will be placed.
     * @param {Boolean} [minifyHtml=true] Show the HTML
     */
    static async compressUiWebComponent(file, toFolder, minifyHtml=true) {
        // Get folder location
        const folder = Path.dirname(file);

        // Get name
        const name = Path.basename(file, '.js');

        // Set CSS and HTML paths
        const cssPath = Path.join(folder, name + '.css');
        const htmlPath = Path.join(folder, name + '.html');

        // Read in file data
        let javaScript = await readFile(file, { encoding: 'utf8' });
        let css = await readFile(cssPath, { encoding: 'utf8' });
        let html = await readFile(htmlPath, { encoding: 'utf8' });

        // Minify the CSS and HTML parts
        css = BuildTools._minifyCss(css);
        if (minifyHtml === true) html = BuildTools._minifyHtml(html);

        // Find the "UiTools.createUi(" part of the JavaScript file
        const startIndex = javaScript.indexOf('UiTools.createUi(');
        if (startIndex === -1) throw new Error('Unable to find UiTools.createUi in ' + file);

        // Find the ending , part and set the class name
        const endIndex = javaScript.indexOf(',', startIndex);
        const className = javaScript.substring(startIndex + 17, endIndex);

        // Set new JavaScript that sets the new CSS and HTML constants
        const javaScriptList = [];
        javaScriptList.push(className);
        javaScriptList.push('.uiCss = `');
        javaScriptList.push(css);
        javaScriptList.push('`;\n');
        javaScriptList.push(className);
        javaScriptList.push('.uiHtml = `');
        javaScriptList.push(html);
        javaScriptList.push('`;\n');

        // Insert the JavaScript constants
        let javaScriptWithConstants =
            javaScript.substring(0, startIndex) +
            javaScriptList.join('') +
            javaScript.substring(startIndex);

        // Set to min file
        const toMinFile = Path.join(toFolder, name + '.js');

        // Minify the file
        const fileMinifyResult = await minify(
            javaScriptWithConstants,
            {
                module: true,
                mangle: {
                    properties: {
                        regex: /^_(?!ui)/
                    }       
                }
            }
        );

        // Set final file data
        const fileData = BuildTools._jsSignature + '\n' + fileMinifyResult.code;

        // Write the result to the to folder
        await writeFile(toMinFile, fileData);
    }

    /**
     * Compress a JavaScript file (minify it).
     * @param {String} fromFile The file to compress from.
     * @param {String} toFile Where to write the compressed file to.
     */
    static async compressJavaScript(fromFile, toFile) {
        // Read in file data
        let javaScript = await readFile(fromFile, { encoding: 'utf8' });

        // Replace the where the UiTools is imported from (if used)
        javaScript = javaScript.replace('import { UiTools } from "../ui-tools.js";', 'import { UiTools } from "./ui-tools.js";');

        // Minify any embedded CSS
        javaScript = BuildTools._minifyEmbeddedCss(javaScript);

        // Minify any embedded HTML
        javaScript = BuildTools._minifyEmbeddedHtml(javaScript);

        // Minify the file
        const fileMinifyResult = await minify(
            javaScript,
            {
                module: true,
                mangle: {
                    properties: {
                        regex: /^_/
                    }       
                }
            }
        );

        // Set final file data
        const fileData = BuildTools._jsSignature + '\n' + fileMinifyResult.code;

        // Write the result to the to folder
        await writeFile(toFile, fileData);
    }

    /**
     * Compress a CSS file (minify it).
     * @param {String} fromFile The file to compress from.
     * @param {String} toFile Where to write the compressed file to.
     */
    static async compressCss(fromFile, toFile) {
        // Read in file data
        let css = await readFile(fromFile, { encoding: 'utf8' });

        // Miniy the CSS
        css = BuildTools._minifyCss(css);

        // Set final file data
        const fileData = BuildTools._cssSignature + '\n' + css;

        // Write the result to the to folder
        await writeFile(toFile, fileData);
    }

    /**
     * Minify the given CSS.
     * @param {String} css The CSS text to minify.
     * @return {String} The new CSS text.
     */
    static _minifyCss(css) {
        // Remove the comments
        css = css.replaceAll(BuildTools._cssCommentRegExp, ' ');

        // Replace new line characters with spaces
        css = css.replaceAll('\r', ' ');
        css = css.replaceAll('\n', ' ');

        // Replace multple spaces with a single space
        css = css.replaceAll(BuildTools._multipleSpaceRegExp, ' ');

        // Replace unneeded spaces
        css = css.replaceAll(' } ', '}');
        css = css.replaceAll(' { ', '{');
        css = css.replaceAll('; ', ';');
        css = css.replaceAll(': ', ':');

        // Return the CSS
        return css;
    }

    /**
     * Minify the given HTML.
     * @param {String} html The HTML text to minify.
     * @return {String} The new HTML text.
     */
    static _minifyHtml(html) {
        // Remove the comments
        html = html.replaceAll(BuildTools._htmlCommentRegExp, ' ');

        // Replace new line characters with spaces
        html = html.replaceAll('\r', ' ');
        html = html.replaceAll('\n', ' ');

        // Replace multple spaces with a single space
        html = html.replaceAll(BuildTools._multipleSpaceRegExp, ' ');

        // Replace spaces inside > < parts
        html = html.replaceAll('> <', '><');

        // Return the HTML
        return html;
    }

    /**
     * Minify embedded CSS. This looks for CSS inside JavaScript.
     * @param {String} javaScript The JavaScript source code that contains embedded CSS.
     * @return {String} The same JavaScript source code but with minified embedded CSS.
     */
    static _minifyEmbeddedCss(javaScript) {
        // Set current index
        let currentIndex = -1;

        // Loop
        while (true) {
            // Look for /*css*/`....`
            const cssCommentIndex = javaScript.indexOf('/*css*/', currentIndex);

            // If not found then finish
            if (cssCommentIndex === -1) return javaScript;

            // Get starting ` character
            const cssStringStartIndex = javaScript.indexOf('`', cssCommentIndex);

            // If not found
            if (cssStringStartIndex === -1) return javaScript;

            // Get ending ` character
            const cssStringEndIndex = javaScript.indexOf('`', cssStringStartIndex + 1);

            // If not found
            if (cssStringEndIndex === -1) return javaScript;

            // Get the whole string
            let cssString = javaScript.substring(cssStringStartIndex + 1, cssStringEndIndex);

            // Minify the CSS
            cssString = BuildTools._minifyCss(cssString);

            // Replace the old CSS string with the new one
            javaScript =
                javaScript.substring(0, cssStringStartIndex + 1) +
                cssString +
                javaScript.substring(cssStringEndIndex);

            // Update the current index
            currentIndex = cssStringStartIndex + 1;
        }
    }

    /**
     * Minify embedded HTML. This looks for HTML inside JavaScript.
     * @param {String} javaScript The JavaScript source code that contains embedded HTML.
     * @return {String} The same JavaScript source code but with minified embedded HTML.
     */
    static _minifyEmbeddedHtml(javaScript) {
        // Set current index
        let currentIndex = -1;

        // Set regex
        const multipleSpace = new RegExp(' +', 'g');

        // Loop
        while (true) {
            // Look for /*html*/`....`
            const htmlCommentIndex = javaScript.indexOf('/*html*/', currentIndex);

            // If not found then finish
            if (htmlCommentIndex === -1) return javaScript;

            // Get starting ` character
            const htmlStringStartIndex = javaScript.indexOf('`', htmlCommentIndex);

            // If not found
            if (htmlStringStartIndex === -1) return javaScript;

            // Get ending ` character
            const htmlStringEndIndex = javaScript.indexOf('`', htmlStringStartIndex + 1);

            // If not found
            if (htmlStringEndIndex === -1) return javaScript;

            // Get the whole string
            let htmlString = javaScript.substring(htmlStringStartIndex + 1, htmlStringEndIndex);

            // Minify the HTML
            htmlString = BuildTools._minifyHtml(htmlString);

            // Replace the old HTML string with the new one
            javaScript =
                javaScript.substring(0, htmlStringStartIndex + 1) +
                htmlString +
                javaScript.substring(htmlStringEndIndex);

            // Update the current index
            currentIndex = htmlStringStartIndex + 1;
        }
    }
}
