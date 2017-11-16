'use strict';

import Backbone from 'backbone';

module.exports = {

    /**
     * @param {String} route
     * @param {Object} [options]
     * @returns {Boolean}
     */
    navigate: function (route, options) {
        options = options || {};
        Backbone.history.navigate(route.toString(), options);
        return true;
    },

    /**
     * Error
     *
     * @param {Error}   err
     * @param {String}  nice_msg
     */
    showError: function(err, nice_msg) {
        require(['./main', './error/main'], (App, View) => {
            App.UI.showChildView('mainRegion', new View({
                err:      err,
                nice_msg: nice_msg
            }));
        });
    },

    /**
     * Default
     */
    showDefault: function() {
        require(['./main', './dashboard/main'], (App, View) => {
            //this.navigate('/');
            App.UI.showChildView('mainRegion', new View());
        });
    }
};

