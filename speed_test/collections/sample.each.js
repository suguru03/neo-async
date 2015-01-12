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
var array = _.sample(_.times(count), count);
var c = 0;
var iterator = function(n, callback) {
  c++;
  callback();
};
var funcs = {
  'async': function(callback) {
    c = 0;
    async.each(array, iterator, callback);
  },
  'neo-async': function(callback) {
    c = 0;
    neo_async.each(array, iterator, callback);
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


