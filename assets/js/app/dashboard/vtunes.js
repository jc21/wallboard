'use strict';

import Mn from 'backbone.marionette';

const template = require('./vtunes.ejs');
const vtunes   = require('../../lib/vtunes');
const moment   = require('moment');

module.exports = Mn.View.extend({
    template:  template,
    className: 'vtunes',

    ui: {
        progress: '.progressbar',
        track:    '.track'
    },

    update: function () {
        let view = this;

        vtunes.Queue.getNowPlaying()
            .then((data) => {
                let now        = moment().unix();
                let curr       = Math.min(now - data.played_on, data.track.length);
                let remain     = Math.max(0, data.track.length - (now - data.played_on));
                let diff       = curr / (curr + remain);
                let percentage = Math.min(100, diff * 100);

                if (diff >= 1.5) {
                    percentage = 0;
                    view.$el.hide();
                } else {
                    view.$el.show();
                }

                view.ui.progress.css('width', percentage + '%');

                // contstruct artist
                let artists = [];
                _.each(data.track.artist, function (artist) {
                    artists.push(artist.name);
                });

                view.ui.track.text(data.track.title + ' - ' + artists.join(', '));
            })
            .catch((err) => {
                console.log(err);
                view.$el.hide();
            })
            .then(() => {
                setTimeout(function () { view.update(); }, 2000);
            });
    },

    onRender: function () {
        this.update();
    }
});
