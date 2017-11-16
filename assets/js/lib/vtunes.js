'use strict';

import $ from 'jquery';
import _ from 'lodash';

const config = require('../data/config.json');

/**
 * @param {String} message
 * @param {*} debug
 * @param {Integer} code
 * @constructor
 */
const ApiError = function (message, debug, code) {
    let temp     = Error.call(this, message);
    temp.name    = this.name = 'ApiError';
    this.stack   = temp.stack;
    this.message = temp.message;
    this.debug   = debug;
    this.code    = code;
};

ApiError.prototype = Object.create(Error.prototype, {
    constructor: {
        value:        ApiError,
        writable:     true,
        configurable: true
    }
});

function fetch(verb, path, data, options) {
    options = options || {};

    return new Promise(function (resolve, reject) {
        $.ajax({
            url:         config.vtunes.host + '/api/' + path,
            data:        data,
            type:        verb,
            dataType:    'json',
            crossDomain: true,
            timeout:     (options.timeout ? options.timeout : 15000),
            xhrFields:   {
                withCredentials: true
            },

            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + config.vtunes.token);
            },

            success: function (data, textStatus, response) {
                let total = response.getResponseHeader('X-Dataset-Total');
                if (total !== null) {
                    resolve({
                        data: data,
                        pagination: {
                            total:  parseInt(total, 10),
                            offset: parseInt(response.getResponseHeader('X-Dataset-Offset'), 10),
                            limit:  parseInt(response.getResponseHeader('X-Dataset-Limit'), 10)
                        }
                    });
                } else {
                    resolve(response);
                }
            },

            error: function (xhr, status, error_thrown) {
                let code = 400;

                if (typeof xhr.responseJSON !== 'undefined' && typeof xhr.responseJSON.error !== 'undefined' && typeof xhr.responseJSON.error.message !== 'undefined') {
                    error_thrown = xhr.responseJSON.error.message;
                    code = xhr.responseJSON.error.code || 500;
                }

                reject(new ApiError(error_thrown, xhr.responseText, code));
            }
        });
    });
}

function makeExpansionString(expand) {
    let items = [];
    _.forEach(expand, function (exp) {
        items.push(encodeURIComponent(exp));
    });

    return items.join(',');
}

module.exports = {
    status: function () {
        return fetch('get', '');
    },

    Queue: {
        get: function (expand) {
            return fetch('get', 'queue' + (typeof expand === 'object' && expand.length ? '?expand=' + makeExpansionString(expand) : ''));
        },

        getNowPlaying: function () {
            return fetch('get', 'queue/current');
        },

        getAllRecent: function (offset, limit, sort, expand, query) {
            return fetch('get', 'queue/recent?offset=' + (offset ? offset : 0) + '&limit=' + (limit ? limit : 20) + (sort ? '&sort=' + sort : '') + (typeof expand === 'object' && expand !== null && expand.length ? '&expand=' + makeExpansionString(expand) : '') + (typeof query === 'string' ? '&query=' + query : ''));
        }
    }
};
