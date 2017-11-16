'use strict';

import Backbone from 'backbone';

let data = [
    {
        name: 'Brisbane',
        timezone: 'Australia/Brisbane'
    },
    {
        name: 'Manila',
        timezone: 'Singapore'
    },
    {
        name: 'West Coast',
        timezone: 'America/Los_Angeles'
    },
    {
        name: 'East Coast',
        timezone: 'America/New_York'
    }
];

module.exports = new Backbone.Collection(data);
