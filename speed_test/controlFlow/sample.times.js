#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var async = require('async');
var neo_async = require('../../');

// loop count
var count = 100;
// sampling times
var times = 1000;
var iterator = function(n, done) {
  done(null, n);
};

var funcs = {
  'async': function(callback) {
    async.times(count, iterator, callback);
  },
  'neo-async': function(callback) {
    neo_async.times(count, iterator, callback);
  }
};

comparator
  .set(funcs)
  .option({
    async: true,
    times: times
  })
  .start()
  .result(function(err, res) {
    console.log(res);
  });
