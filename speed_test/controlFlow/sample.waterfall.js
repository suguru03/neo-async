#!/usr/bin/env node --stack-size=65536
'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async = require('../../');

// roop count
var count = 10;
// sampling times
var times = 1000;
var array = _.sample(_.times(count), count);
var tasks = _.map(array, function(n, i) {
  if (i === 0) {
    return function(next) {
      next(null, n);
    };
  }
  return function(total, next) {
    next(null, total + n);
  };
});
var funcs = {
  'async': function(callback) {
    async.waterfall(tasks, callback);
  },
  'neo-async': function(callback) {
    neo_async.waterfall(tasks, callback);
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


