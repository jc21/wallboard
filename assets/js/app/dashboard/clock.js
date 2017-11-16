'use strict';

import Mn from 'backbone.marionette';
import momentz from 'moment-timezone';

const template = require('./clock.ejs');

module.exports = Mn.View.extend({
    template:  template,
    tagName:   'div',
    className: 'col-md-6 clock',

    ui: {
        time:     'div:eq(0)',
        hm:       '.hm',
        sec:      '.sec'
    },

    updateTime: function () {
        let tz       = momentz().tz(this.model.get('timezone'));
        let hour     = parseInt(tz.format('H'), 10);
        let hm       = tz.format('HH:mm');
        let sec      = tz.format('ss');
        let meridian = tz.format('a');

        this.ui.time.removeClass('meridian-am meridian-pm workhours').addClass('meridian-' + meridian);

        let inside_workhours = hour >= 8 && hour < 17;
        if (inside_workhours) {
            this.ui.time.addClass('workhours');
        }

        this.ui.hm.text(hm);
        this.ui.sec.text(sec);
    },

    onRender: function () {
        this.updateTime();
        setInterval(() => { this.updateTime(); }, 1000);
    }
});
