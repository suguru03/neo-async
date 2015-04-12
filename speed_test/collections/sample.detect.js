#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async_v0 = require('neo-async');
var neo_async_v1 = require('../../');

// loop count
var count = 100;
// sampling times
var times = 100000;
var array = _.shuffle(_.times(count));
var iterator = function(n, callback) {
  callback(null, false);
};
var funcs = {
  'async': function(callback) {
    async.detect(array, iterator, callback);
  },
  'neo-async_v0': function(callback) {
    neo_async_v0.detect(array, iterator, callback);
  },
  'neo-async_v1': function(callback) {
    neo_async_v1.detect(array, iterator, callback);
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
