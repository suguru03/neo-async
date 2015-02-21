#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async = require('../../');

// loop count
var count = 10;
// sampling times
var times = 1000;
var array = _.shuffle(_.times(count));
var c = 0;
var iterator = function(n, callback) {
  callback(null, c++);
};
var funcs = {
  'async': function(callback) {
    c = 0;
    async.mapSeries(array, iterator, callback);
  },
  'neo-async': function(callback) {
    c = 0;
    neo_async.mapSeries(array, iterator, callback);
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
