# Wallboard

A simplistic Wallboard interface.

[See it in action](https://s3-ap-southeast-2.amazonaws.com/jc21-dashboard/index.html)

## Local development setup

Docker and docker-compose are required. If you are running this on a shared host, be sure to change the exposed http port from 80 to something else in `docker-compose.yml`

Run the application locally:

1. Checkout the codebase
2. run `bin/npm install`
3. run `docker-compose up`
4. visit http://localhost

This will start a nginx docker container and a gulp container that will compile your changes to JS, SCSS and any images.


## Development specifics

The application is built with:

- Bootstrap 3
- Backbone 1.3
- Marionette 3.1
- Webpack 2 w/ Babel

All changes to files should be made in the `/assets` folder, these files are compiled or copied to the `web/dist` folder by gulp.

Everything in `/assets` gets compiled:

- js to a single uglified file converted to ES2015, so that means you can write JS in the latest form and it will run in almost all browsers
- scss to a single compressed css file
- images are minified where possible

If you want to add JS packages you should use `bin/npm install yourpackage` and then you can simply use `import pkg from "yourpackage";` in code to use it. The use
of bower for dependencies is strongly discouraged in this paradigm.

Refer to `/assets/scss/styles.scss` for an example of how to import css from npm packages too.


## Deployment

Assuming you have your `s3cmd` configured to connect to the s3 bucket specified in `bin/upload`:

1. run `bin/build`
2. run `bin/upload`
