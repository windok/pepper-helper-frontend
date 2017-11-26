/* eslint-disable */

import splashCss from 'raw-loader!assets/splash.css';

/**
 * Generates a template when compiled with HtmlWebpackPlugin.
 *
 * The template will include:
 * - The title
 * - An optional meta description
 * - An optional meta keywords
 * - Any links to css files
 * - An optional react root id
 * - Any javascript file chunks
 * - An optional google analytics script
 */
export default function (templateParams) {

    let htmlWebpackPlugin = templateParams.htmlWebpackPlugin;
    let options = htmlWebpackPlugin.options;

    let meta = '<meta charset="utf-8">'
        + '<meta http-equiv="X-UA-Compatible" content="IE=edge">'
        + '<meta name="viewport" content="width=device-width, initial-scale=1">';

    if (options.description) {
        meta += '<meta name="description" content="' + options.description + '">';
    }

    if (options.keywords) {
        meta += '<meta name="keywords" content="' + options.keywords + '">';
    }

    let css = htmlWebpackPlugin.files.css.concat(options.externalCSS || []).map(function (href) {
        return '<link href="' + href + '" rel="stylesheet">';
    }).join('');

    let inlineCss = options.splash ? '<style>' + splashCss + '</style>' : '';
    let title = '<title>' + options.title + '</title>';
    let head = '<head>' + meta + title + inlineCss + css + '</head>';

    let entry = '';
    if (options.appMountId) {
        entry = '<div id="' + options.appMountId + '">';
        if (options.splash) {
            entry += '\n<div class="splash"><svg xmlns="http://www.w3.org/2000/svg"><use xlink:href="#svglogo"></use></svg></div>\n';
        }

        entry += '</div>';
    }

    // must load Intl Polyfill before our own files
    let js = (options.externalJS || []).concat(htmlWebpackPlugin.files.js).map(function (chunk) {
        return `<script src="${chunk}" defer></script>`;
    }).join('');

    let sprites = Object.keys(htmlWebpackPlugin.files.sprites || [])
        .map(key => htmlWebpackPlugin.files.sprites[key]).join('');

    let body = '<body>' + entry + js + '\n<div style="display: none;">' + sprites + '</div>\n</body>';
    let html = '<html';
    if (options.production) {
        html += ' manifest="/appcache/manifest.appcache"';
    }

    html += '>' + head + body + '</html>';

    return '<!DOCTYPE html>' + html;
};