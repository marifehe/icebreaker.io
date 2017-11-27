'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**', '!coverage/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
