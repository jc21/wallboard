const AppRouter  = require('marionette.approuter');
const Controller = require('./controller');

module.exports = AppRouter.default.extend({
    controller: Controller,
    appRoutes:  {
        '*default': 'showDefault'
    }
});
