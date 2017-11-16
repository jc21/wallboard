'use strict';

import Mn from 'backbone.marionette';

const collection = require('../../data/clocks');
const ClockView  = require('./clock');
const VtunesView = require('./vtunes');

const RowView = Mn.CollectionView.extend({
    className: 'row',
    childView: ClockView
});

module.exports = Mn.View.extend({
    template: '<div><div><!-- clocks --></div><div><!-- vtunes --></div></div>',

    regions: {
        clocks: {
            el: '> div:eq(0)',
            replaceElement: true
        },
        vtunes: {
            el: '> div:eq(1)',
            replaceElement: true
        }
    },

    onRender: function() {
        this.showChildView('clocks', new RowView({
            collection: collection
        }));

        this.showChildView('vtunes', new VtunesView());
    }
});
