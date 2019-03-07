const $          = require('jquery');
const _          = require('underscore');
const Backbone   = require('backbone');
const Mn         = require('backbone.marionette');
const Controller = require('./controller');
const Router     = require('./router');
const UI         = require('./ui/main');

const App = Mn.Application.extend({

    region:     '#app',
    UI:         null,
    Controller: Controller,
    version:    null,

    onStart: function (app, options) {
        console.log('Welcome to Dashboard');

        this.UI = new UI();
        this.UI.on('render', () => {
            // If successful, start the history and routing
            new Router(options);

            Backbone.history.start({pushState: true, root: '/'});

            // Remove loading class
            $('#app').removeClass('loading');
            this.versionCheck();
        });

        this.getRegion().show(this.UI);
    },

    History: {
        replace: (data) => {
            window.history.replaceState(_.extend(window.history.state || {}, data), document.title);
        },

        get: (attr) => {
            return window.history.state ? window.history.state[attr] : undefined;
        }
    },

    Error: function (code, message, debug) {
        let temp  = Error.call(this, message);
        temp.name = this.name = 'AppError';
        this.stack   = temp.stack;
        this.message = temp.message;
        this.code    = code;
        this.debug   = debug;
    },

    showError: function () {
        let ErrorView = Mn.View.extend({
            tagName:  'section',
            id:       'error',
            template: _.template('Error loading Dashboard. Please reload the app.')
        });

        this.getRegion().show(new ErrorView());
    },

    getParam: function (name) {
        name        = name.replace(/[\[\]]/g, '\\$&');
        let url     = window.location.href;
        let regex   = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        let results = regex.exec(url);

        if (!results) {
            return null;
        }

        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    versionCheck: function () {
        let view = this;
        // TODO
        return new Promise(function (resolve, reject) {
            $.ajax({
                url:         'version.json',
                type:        'get',
                dataType:    'json',
                crossDomain: true,
                timeout:     5000,

                success: function (data, textStatus, response) {
                    resolve(response);
                },

                error: function (xhr, status, error_thrown) {
                    let code = 400;

                    if (typeof xhr.responseJSON !== 'undefined' && typeof xhr.responseJSON.error !== 'undefined' && typeof xhr.responseJSON.error.message !== 'undefined') {
                        error_thrown = xhr.responseJSON.error.message;
                        code         = xhr.responseJSON.error.code || 500;
                    }

                    reject(new Error(error_thrown, xhr.responseText, code));
                }
            });
        })
            .then((data) => {
                if (view.version === null) {
                    view.version = data.version;
                    console.log('Current version: ', view.version);
                } else if (view.version !== data.version) {
                    // Reload
                    document.location.reload();
                }
            })
            .catch((err) => {
                console.log('Could not check version :sadface:', err.message);
            })
            .then(() => {
                // check again in 10 seconds
                setTimeout(function () {
                    view.versionCheck();
                }, 30000);
            });
    }
});

const app      = new App();
module.exports = app;
