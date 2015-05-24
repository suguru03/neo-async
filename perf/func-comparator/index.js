'use strict';

var _ = require('lodash');
var Comparator = require('func-comparator').Comparator;

var async = require('../../');
var functions = {
  'async': require('async'),
  'neo-async_v0': require('neo-async'),
  'neo-async_v1': async
};

var config = global.config || require('../config');

var defaults = config.defaults;
var tasks = _.omit(config, 'defaults');

var args = global.argv || _.slice(process.argv, 2);
if (!_.isEmpty(args)) {
  var regExps = _.map(args, function(arg) {
    return new RegExp('^' + arg);
  });
  tasks = _.pick(tasks, function(task, name) {
    return _.some(regExps, function(regExp) {
      return regExp.test(name);
    });
  });
}

async.safe.eachSeries(tasks, function(task, name, next) {
  var avaiable = task.avaiable === undefined ? defaults.avaiable : task.avaiable;
  if (!avaiable) {
    return next();
  }
  var count = task.count || defaults.count;
  var times = task.times || defaults.times;
  var setup = task.setup || defaults.setup;

  var func = task.func || defaults.func;
  var useFunctions = task.functions || defaults.functions;

  var funcs = _.chain(functions)
    .pick(useFunctions)
    .mapValues(function(async) {
      return function(callback) {
        func(async, callback);
      };
    })
    .value();

  setup(count);

  console.log('--------------------------------------');
  console.log('[' + name + '] Comparating... ', useFunctions);
  new Comparator()
    .set(funcs)
    .async()
    .times(times)
    .start()
    .result(function(err, res) {
      console.log(res);
      next();
    });
});

