#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var async = require('async');
var neo_async_v0 = require('neo-async');
var neo_async_v1 = require('../../../');

// loop count
var count = 100;
// sampling times
var times = 100000;
var iterator = function(n, done) {
  done(null, n);
};

var funcs = {
  'async': function(callback) {
    async.times(count, iterator, callback);
  },
  'neo-async_v0': function(callback) {
    neo_async_v0.times(count, iterator, callback);
  },
  'neo-async_v1': function(callback) {
    neo_async_v1.times(count, iterator, callback);
  }
};

comparator
  .set(funcs)
  .async()
  .times(times)
  .start()
  .result(function(err, res) {
    console.log(res);
  });
