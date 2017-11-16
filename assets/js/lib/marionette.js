'use strict';

import Mn from 'backbone.marionette';
import moment from 'moment';
import numeral from 'numeral';
import Helpers from '../app/helpers';

let render = Mn.Renderer.render;
Mn.Renderer.render = function (template, data, view) {

    data = _.clone(data);

    /**
     * @param {Integer} number
     * @returns {String}
     */
    data.niceNumber = function(number) {
        return numeral(number).format('0,0');
    };

    /**
     * @param {Integer} seconds
     * @returns {String}
     */
    data.secondsToTime = function(seconds) {
        let sec_num = parseInt(seconds, 10);
        let minutes = Math.floor(sec_num / 60);
        let sec     = sec_num - (minutes * 60);

        if (sec < 10) {
            sec = '0' + sec;
        }

        return minutes + ':' + sec;
    };

    /**
     * @param {String} date
     * @returns {String}
     */
    data.shortDate = function(date) {
        let shortdate = '';

        if (typeof date === 'number') {
            shortdate = moment.unix(date).format('YYYY-MM-DD');
        } else {
            shortdate = moment(date).format('YYYY-MM-DD');
        }

        return moment().format('YYYY-MM-DD') === shortdate ? 'Today' : shortdate;
    };

    /**
     * @param {String} string
     * @returns {String}
     */
    data.escape = function(string) {
        let entityMap = {
            '&':  '&amp;',
            '<':  '&lt;',
            '>':  '&gt;',
            '"':  '&quot;',
            '\'': '&#39;',
            '/':  '&#x2F;'
        };

        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    };

    /**
     * @param {String} string
     * @param {Integer} length
     * @returns {String}
     */
    data.trim = function (string, length) {
        if (string.length > length) {
            let trimmedString = string.substr(0, length);
            return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + '...';
        }

        return string;
    };

    /**
     * @param {Array} artists
     * @returns {String}
     */
    data.getArtistLinks = function (artists) {
        let artist_strings = [];
        _.forEach(artists, (artist) => {
            artist_strings.push('<a class="artist-link" data-artist_id="' + artist.id + '" href="/artist/' + artist.id + '" title="' + Helpers.escape(artist.name) + '">' + Helpers.escape(artist.name) + '</a>');
        });

        return artist_strings.join(', ');
    };

    /**
     * @param {Object} album
     * @returns {String}
     */
    data.getAlbumLink = function (album) {
        if (album) {
            return '<a class="album-link" data-album_id="' + album.id + '" href="/album/' + album.id + '" title="' + Helpers.escape(album.name) + '">' + Helpers.escape(album.name) + '</a>';
        }

        return '';
    };

    return render.call(this, template, data, view);
};

module.exports = Mn;

