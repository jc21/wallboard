// This has to exist here so that Webpack picks it up
import '../scss/styles.scss';

const $   = require('jquery');
const App = require('./app/main');

$(document).ready(() => {
    App.start();
});
