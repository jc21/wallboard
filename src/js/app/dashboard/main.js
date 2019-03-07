const Mn         = require('backbone.marionette');
const collection = require('../../data/clocks');
const ClockView  = require('./clock');
const template   = require('./main.ejs');

const RowView = Mn.CollectionView.extend({
    className: 'row',
    childView: ClockView
});

module.exports = Mn.View.extend({
    template: template,

    regions: {
        clocks: {
            el:             '> div:eq(0)',
            replaceElement: true
        }
    },

    onRender: function () {
        this.showChildView('clocks', new RowView({
            collection: collection
        }));
    }
});
