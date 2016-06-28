'use strict';

const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const http = require('http');

const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('release', done => {
  runSequence(
    // 'test',
    'minify',
    'test:min',
    done);
});

gulp.task('minify', done => {
  let filepath =  path.resolve(__dirname, '../..', 'lib', 'async.js');
  let target = path.resolve(__dirname, '../..', 'lib', 'async.min.js');
  let file = fs.readFileSync(filepath, 'utf8');
  let body = qs.stringify({
    js_code: file,
    compilation_level: 'SIMPLE_OPTIMIZATIONS',
    // compilation_level: 'ADVANCED_OPTIMIZATIONS',
    output_format: 'text',
    output_info: 'compiled_code'
  });
  let opts = {
    hostname: 'closure-compiler.appspot.com',
    port: 80,
    path: '/compile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content_length': Buffer.byteLength(file)
    }
  };
  let data = '';
  let req = http.request(opts, res => {
    res.setEncoding('utf8')
    .on('data', res => {
      data += res;
    })
    .on('error', done)
    .on('end', () => {
      fs.writeFile(target, data, 'utf8', done);
    });
  })
  .on('error', done);
  req.write(body);
  req.end();
});

