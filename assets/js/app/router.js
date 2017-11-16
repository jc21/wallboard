'use strict';

const Mn         = require('../lib/marionette');
const Controller = require('./controller');

module.exports = Mn.AppRouter.extend({
    appRoutes: {
        '*default': 'showDefault'
    },

    initialize: function() {
        this.controller = Controller;
    },

    onRoute: function(name, path, args) {
        console.log('User navigated to ' + path);
    }
});
