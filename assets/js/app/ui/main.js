'use strict';

import Mn from 'backbone.marionette';

const template = require('./main.ejs');

module.exports = Mn.View.extend({
    template: template,

    ui: {
        mainRegion: 'section:eq(0)'
    },

    regions: {
        mainRegion:   '@ui.mainRegion'
    },

    resizeUi: function () {
        let height = $(window).height();
        this.ui.mainRegion.height(height);
    },

    showMainLoading: function () {
        this.ui.mainRegion.addClass('loading');
    },

    hideMainLoading: function () {
        this.ui.mainRegion.removeClass('loading');
    },

    onRender: function () {
        let view = this;
        $(window).on('resize', () => {
            view.resizeUi();
        });

        setTimeout(() => {
            view.resizeUi();
        }, 50);
    }
});
