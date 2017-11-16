/*jshint node:true */

'use strict';

const path        = require('path');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const spawn       = require('gulp-spawn');
const plumber     = require('gulp-plumber');
const bourbon     = require('node-bourbon');
const minifyCSS   = require('gulp-minify-css');
const concat      = require('gulp-concat-util');
const runSequence = require('run-sequence');
const webpack     = require('gulp-webpack');
const imagemin    = require('gulp-imagemin');
const del         = require('del');
const bump        = require('gulp-bump');

const assets = {
    fonts: {
        watch: 'assets/fonts/**/*.{ttf,woff,woff2,eof,eot,svg,otf}',
        dest:  'web/dist/fonts'
    },
    images: {
        watch: 'assets/images/**/*.{png,jpg,gif}',
        dest:  'web/dist/images'
    },
    scss: {
        watch:    'assets/scss/**/*.scss',
        loadPath: 'assets/scss',
        src:      'assets/scss/styles.scss',
        dest:     'web/dist/css'
    },
    js: {
        watch: 'assets/js/**/*',
        src:   'assets/js/main.js',
        dest:  'web/dist/js/'
    }
};

/**
 * @param color
 * @param label
 * @returns {Function}
 */
function logger(color, label) {
    return function () {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(gutil.colors[color].bold(label.toUpperCase() + ':'));
        gutil.log.apply(null, args);
    };
}

gutil.error  = logger('red', 'error');
gutil.warn   = logger('yellow', 'warn');
gutil.notice = logger('white', 'notice');

/**
 * @param err
 */
function handleError(err) {
    gutil.error(err.stack);
}

/**
 * @param data
 * @returns {{cmd: *, args: *[], filename: filename}}
 */
function getSassCommand(data) {
    let includes = bourbon.with([data.loadPath]);
    let sassc_path = './bin/sassc.' + process.platform + '.' + process.arch;

    return {
        cmd: path.resolve(sassc_path),
        args: [
            '--stdin',
            '--sourcemap',
            '--load-path', includes.join(':')
        ],
        filename: function (base/*, ext*/) {
            return base + '.css';
        }
    };
}

/*****************************
 TASKS
 ******************************/

/**
 * clean
 */
gulp.task('clean', function (cb) {
    del(['./web/dist'])
        .then(function () {
            cb();
        })
        .catch(handleError);
});

/**
 * images
 */
gulp.task('images', function () {
    if (process.arch !== 'arm') {
        return gulp.src(assets.images.watch)
            .pipe(imagemin({
                optimizationLevel: 7
            }))
            .pipe(gulp.dest(assets.images.dest))
            .on('error', handleError);
    } else {
        return gulp.src(assets.images.watch)
            .pipe(gulp.dest(assets.images.dest))
            .on('error', handleError);
    }
});

/**
 * fonts
 */
gulp.task('fonts', function () {
    return gulp.src(assets.fonts.watch)
        .pipe(gulp.dest(assets.fonts.dest))
        .on('error', handleError);
});

/**
 * scss
 */
gulp.task('scss', function () {
    return gulp.src(assets.scss.src)
        .pipe(plumber())
        .pipe(spawn(getSassCommand(assets.scss)))
        .pipe(minifyCSS({
            keepSpecialComments: 0
        }))
        .pipe(concat.header('@import url(\'https://fonts.googleapis.com/css?family=Lato:700|Open+Sans:800\');'))
        .pipe(gulp.dest(path.resolve(assets.scss.dest)))
        .on('error', handleError);
});

/**
 * js
 */
gulp.task('js', function () {
    return gulp.src(assets.js.src)
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest(assets.js.dest))
        .on('error', handleError);
});

/**
 * bump
 */
gulp.task('bump', function() {
    gulp.src('./web/version.json')
        .pipe(bump())
        .pipe(gulp.dest('./web/'));
});

/**
 * build
 */
gulp.task('build', function (cb) {
    runSequence('clean', ['images', 'fonts', 'scss', 'js', 'bump'], cb);
});

/**
 * default
 */
gulp.task('default', ['images', 'fonts', 'scss', 'js'], function () {
    gulp.watch(assets.scss.watch, ['scss']);
    gulp.watch(assets.images.watch, ['images']);
    gulp.watch(assets.fonts.watch, ['fonts']);
    gulp.watch(assets.js.watch, ['js']);
    gulp.watch('./webpack.config.js', ['js']);
});
