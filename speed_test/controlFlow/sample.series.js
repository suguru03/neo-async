#!/usr/bin/env node --stack-size=65536

'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var _async = require('_async'); // current async (from npm link)
// var neo_async_v0 = require('neo-async');
// var neo_async_v1 = require('../../');

// loop count
var count = 100;
// sampling times
var times = 100000;
var array = _.shuffle(_.times(count));
var tasks = _.map(array, function() {
  return function(next) {
    next();
  };
});
var funcs = {
  'async': function(callback) {
    async.series(tasks, callback);
  },
  '_async': function(callback) {
    _async.series(tasks, callback);
  }
  // 'neo-async_v0': function(callback) {
  //   neo_async_v0.series(tasks, callback);
  // },
  // 'neo-async_v1': function(callback) {
  //   neo_async_v1.series(tasks, callback);
  // }
};

comparator
  .set(funcs)
  .async()
  .times(times)
  .start()
  .result(function(err, res) {
    console.log(res);
  });
