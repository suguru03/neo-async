'use strict';

var _ = require('lodash');

var Benchmark = require('benchmark');

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

async.eachSeries(tasks, function(task, name, next) {
  var avaiable = task.avaiable === undefined ? defaults.avaiable : task.avaiable;
  if (!avaiable) {
    return next();
  }
  var count = task.count || defaults.count;
  var setup = task.setup || defaults.setup;

  var func = task.func || defaults.func;
  var useFunctions = defaults.functions;
  if (task.functions) {
    useFunctions = _.filter(useFunctions, function(func, index) {
      return _.includes(task.functions, index);
    });
  }

  var funcs = _.chain(functions)
    .pick(useFunctions)
    .mapValues(function(async, key) {
      if (_.isFunction(func)) {
        return function(callback) {
          func(async, callback);
        };
      }
      var _func = func[key] || func['default'];
      return function(callback) {
        _func(async, callback);
      };
    })
    .value();

  setup(count);

  var suite = new Benchmark.Suite();
  var total = {};
  _.forEach(funcs, function(func, key) {
    total[key] = {
      count: 0,
      time: 0
    };
    suite.add(key, {
      defer: true,
      fn: function(deferred) {
        var start = process.hrtime();
        func(function() {
          var diff = process.hrtime(start);
          total[key].time += (diff[0] * 1e9 + diff[1]) / 1000;
          total[key].count++;
          deferred.resolve();
        });
      }
    });
  });

  console.log('--------------------------------------');
  console.log('[' + name + '] Comparating... ', useFunctions);
  suite
    .on('complete', function() {
      _.chain(this)
        .map(function(data) {
          var name = data.name;
          var time = total[name];
          return {
            name: name,
            mean: time.time / time.count
          };
        })
        .sortBy('mean')
        .forEach(function(data, index, array) {
          var name = data.name;
          var mean = data.mean;
          var diff = (_.first(array).mean) / mean;
          console.log('[' + (++index) + ']', '"' + name + '"', (mean.toPrecision(3)) + 'μs' + '[' + diff.toPrecision(3) + ']');
        })
        .value();
      next();
    })
    .run({
      async: true
    });
});
