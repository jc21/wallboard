'use strict';

module.exports = {
    escape: function(string) {
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
    }
};
