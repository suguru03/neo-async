#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async_v0 = require('neo-async');
var neo_async_v1 = require('../../../');

// loop count
var count = 100;
// sampling times
var times = 100000;
var array = _.shuffle(_.times(count));
var c = 0;
var iterator = function(n, callback) {
  callback(c++ % 2);
};
var funcs = {
  'async': function(callback) {
    c = 0;
    async.filterSeries(array, iterator, function(res) {
      callback(null, res);
    });
  },
  'neo-async_v0': function(callback) {
    c = 0;
    neo_async_v0.filterSeries(array, iterator, function(res) {
      callback(null, res);
    });
  },
  'neo-async_v1': function(callback) {
    c = 0;
    neo_async_v1.filterSeries(array, iterator, function(res) {
      callback(null, res);
    });
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
