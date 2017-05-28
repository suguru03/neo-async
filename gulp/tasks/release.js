'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const runSequence = require('run-sequence');
const tagVersion = require('gulp-tag-version');

const packagepath = './package.json';
const types = ['patch', 'minor', 'major'];

_.forEach(types, type => {
  gulp.task(`release:package:${type}`, updateVersion(type));
  gulp.task(`release:${type}`, () => runSequence(
    `release:package:${type}`,
    'minify:local',
    'release:commit',
    'release:tag'
  ));
});

gulp.task('release:tag', () => {
  return gulp.src(packagepath)
    .pipe(tagVersion());
});

gulp.task('release:dist', () => {
  _.forEach(['async.js', 'async.min.js'], file => {
    const filepath = path.resolve(__dirname, '../..', 'lib', file);
    const distpath = path.resolve(__dirname, '../..', 'dist', file);
    fs.createReadStream(filepath)
      .pipe(fs.createWriteStream(distpath));
  });
});

gulp.task('release:commit', () => {
  const packagepath = path.resolve(__dirname, '../..', 'package.json');
  delete require.cache[packagepath];
  const { version } = require(packagepath);
  return gulp.src(['./dist/*', packagepath])
    .pipe(git.commit(version));
});

function updateVersion(type) {
  return () => {
    return gulp.src(packagepath)
        .pipe(bump({ type }))
        .pipe(gulp.dest('./'));
  };
}
