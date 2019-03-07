# Wallboard

A simplistic Wallboard interface.

[See it in action](https://s3-ap-southeast-2.amazonaws.com/jc21-dashboard/index.html)

## Local development setup

Docker and docker-compose are required. If you are running this on a shared host, be sure to change the exposed http port from 80 to something else in `docker-compose.yml`

Run the application locally:

1. Checkout the codebase
2. run `yarn install`
3. run `npm run-script build`
4. run `docker-compose up`
5. visit http://localhost

This will start a nginx docker container and a gulp container that will compile your changes to JS, SCSS and any images.


## Development specifics

The application is built with:

- Bootstrap 4
- Backbone 1.4
- Marionette 4
- Webpack 4 w/ Babel

All changes to files should be made in the `/src` folder, these files are compiled or copied to the `dist` folder by webpack.

Everything in `/src` gets compiled:

- js to a single uglified file, so that means you can write JS in the latest form and it will run in almost all browsers
- scss to a single compressed css file
- images are minified where possible
- html is generated from ejs templates

If you want to add JS packages you should use `yarn add --dev yourpackage` and then you can simply use `const pkg = require('yourpackage');` in code to use it.

Refer to `src/scss/styles.scss` for an example of how to import css from npm packages too.


## Deployment

Assuming you have your `s3cmd` configured to connect to the s3 bucket specified in `bin/upload`:

1. run `npm run-script build`
2. run `bin/upload`
