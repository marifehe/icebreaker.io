'use strict';

const gulp = require('gulp');
const isparta = require('isparta');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

const coverage = 85;

gulp.task('test', () =>
  gulp.src('src/**/*.js')
    .pipe(istanbul({
      includeUntested: true,
      // supports es6
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire())
    .on('end', () => {
      gulp.src('tests/**/*.test.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: coverage } }))
    })
);
