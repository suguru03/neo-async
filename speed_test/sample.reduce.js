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
var iterator = function(total, n, callback) {
  callback(null, total + n);
};
var funcs = {
  'async': function(callback) {
    async.reduce(array, 0, iterator, callback);
  },
  'neo-async': function(callback) {
    neo_async.reduce(array, 0, iterator, callback);
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


