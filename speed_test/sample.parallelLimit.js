#!/usr/bin/env node --stack-size=65536
'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async = require('../');

// roop count
var count = 20;
// sampling times
var times = 1000;
var array = _.sample(_.times(count), count);
var total = 0;
var tasks = _.map(array, function(n) {
  return function(next) {
    total += n;
    next();
  };
});
var funcs = {
  'async': function(callback) {
    total = 0;
    async.parallelLimit(tasks, 4, callback);
  },
  'neo-async': function(callback) {
    total = 0;
    neo_async.parallelLimit(tasks, 4, callback);
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


