const Mn       = require('backbone.marionette');
const momentz  = require('moment-timezone');
const template = require('./clock.ejs');

module.exports = Mn.View.extend({
    template:  template,
    tagName:   'div',
    className: 'col-md-6 clock',

    ui: {
        time: 'div:eq(0)',
        h:    '.h',
        m:    '.m',
        sec:  '.sec'
    },

    updateTime: function () {
        let tz       = momentz().tz(this.model.get('timezone'));
        let hour     = parseInt(tz.format('H'), 10);
        let h        = tz.format('HH');
        let m        = tz.format('mm');
        let sec      = tz.format('ss');
        let meridian = tz.format('a');
        let sec_even = sec % 2 === 0;

        console.log('SEC: ', sec);
        console.log('EVEN: ', sec_even);

        this.ui.time
            .removeClass('meridian-am meridian-pm workhours sec-even')
            .addClass('meridian-' + meridian + (sec_even ? ' sec-even' : ''));

        let inside_workhours = hour >= 8 && hour < 17;
        if (inside_workhours) {
            this.ui.time.addClass('workhours');
        }

        this.ui.h.text(h);
        this.ui.m.text(m);
    },

    onRender: function () {
        this.updateTime();
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }
});
