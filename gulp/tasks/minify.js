'use strict';

const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

const gulp = require('gulp');

const filepath =  path.resolve(__dirname, '../..', 'lib', 'async.js');
const target = path.resolve(__dirname, '../..', 'lib', 'async.min.js');

gulp.task('minify:local', done => {
  const compilerPath = path.resolve(__dirname, '..', 'compiler.jar');
  const command = `java -jar ${compilerPath} --js ${filepath} --js_output_file ${target}`;
  exec(command, done);
});

gulp.task('minify', done => {
  const file = fs.readFileSync(filepath, 'utf8');
  const body = qs.stringify({
    js_code: file,
    compilation_level: 'SIMPLE_OPTIMIZATIONS',
    // compilation_level: 'ADVANCED_OPTIMIZATIONS',
    output_format: 'text',
    output_info: 'compiled_code'
  });
  const opts = {
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
  const req = http.request(opts, res => {
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

