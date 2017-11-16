'use strict';

import $script from 'scriptjs';

/**
 * @param {String} url
 * @param {String} global
 * @param {Integer} [timeout=30000]
 * @returns {Promise}
 */
module.exports = function getScriptPromise(url, global, timeout) {
    timeout = timeout || 30000;

    return new Promise(function (resolve, reject) {

        let resolved = false;
        let rejected = false;

        let t = window.setTimeout(function () {
            if (!resolved && !rejected) {
                reject(new Error('Script load timed out'));
            }
        }, timeout);

        $script([url], function () {
            if (window[global]) {
                resolved = true;
                resolve(window[global]);
            } else {
                rejected = true;
                reject(arguments);
            }

            clearTimeout(t);
        });
    });
};
