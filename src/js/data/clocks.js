const Backbone = require('backbone');

let data = [
    {
        name:     'Brisbane',
        timezone: 'Australia/Brisbane'
    },
    {
        name:     'Manila',
        timezone: 'Singapore'
    },
    {
        name:     'Perth',
        timezone: 'Australia/Perth'
    },
    {
        name:     'New York',
        timezone: 'America/New_York'
    }
];

module.exports = new Backbone.Collection(data);
