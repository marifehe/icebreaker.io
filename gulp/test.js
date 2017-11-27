'use strict';

const gulp = require('gulp');
const isparta = require('isparta');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

const coverage = 90;

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
        .pipe(istanbul.enforceThresholds({ thresholds: { branches: coverage } }))
    })
);
