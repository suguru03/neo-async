'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const tagVersion = require('gulp-tag-version');

const basepath = path.resolve(__dirname, '../../');
const packagepath = path.resolve(basepath, 'package.json');
const bowerpath = path.resolve(basepath, 'bower.json');
const types = ['patch', 'prepatch', 'minor', 'preminor', 'major', 'premajor'];
const { version: prevVersion } = require(packagepath);

gulp.task('release:async', async () => {
  delete require.cache[packagepath];
  const { version } = require(packagepath);
  const asyncpath = path.resolve(basepath, 'lib', 'async.js');
  const file = fs.readFileSync(asyncpath, 'utf8');
  fs.writeFileSync(asyncpath, file.replace(new RegExp(prevVersion, 'g'), version), 'utf8');
});

gulp.task('release:tag', () => {
  return gulp.src(packagepath)
    .pipe(tagVersion());
});

gulp.task('release:dist', async () => {
  _.forEach(['async.js', 'async.min.js'], file => {
    const filepath = path.resolve(basepath, 'lib', file);
    const distpath = path.resolve(basepath, 'dist', file);
    fs.createReadStream(filepath)
      .pipe(fs.createWriteStream(distpath));
  });
});

gulp.task('release:commit', () => {
  delete require.cache[packagepath];
  const { version } = require(packagepath);
  return gulp.src(['./dist/*', './lib/*', packagepath, bowerpath])
    .pipe(git.commit(version));
});

function updatePackageVersion(type) {
  return () => {
    return gulp.src([packagepath, bowerpath])
        .pipe(bump({ type }))
        .pipe(gulp.dest('./'));
  };
}

_.forEach(types, type => {
  gulp.task(`release:package:${type}`, updatePackageVersion(type));
  gulp.task(`release:${type}`, gulp.series(
    `release:package:${type}`,
    'release:async',
    'minify:local',
    'release:dist',
    'release:commit',
    'release:tag',
    'gh-pages'
  ));
});

