#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var neo_async_v0 = require('neo-async');
var neo_async_v1 = require('../../');

// loop count
var count = 100;
// sampling times
var times = 100000;
var iterator = function(n, done) {
  done(null, n);
};

var funcs = {
  'neo-async_v0': function(callback) {
    neo_async_v0.timesLimit(count, 4, iterator, callback);
  },
  'neo-async_v1': function(callback) {
    neo_async_v1.timesLimit(count, 4, iterator, callback);
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
