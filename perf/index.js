'use strict';

var _ = require('lodash');

var argv = require('minimist')(process.argv.slice(2));

var benchmark = argv.b || argv.benchmark; // ['benchmark', 'func-comparator'], -b func-comparator
var count = argv.c || argv.count;
var times = argv.t || argv.times;
var target = argv.target; // -t <function name>

var benchmarks = benchmark ? [benchmark] : [
  'benchmark',
  'func-comparator'
];
benchmarks = _.transform(benchmarks, function(result, name) {
  result[name] = require('./' + name);
}, {});

var async = require('../');
var functions = {
  async: require('async'),
  neo_async: async
};
functions.async.VERSION = require('async/package.json').version;

console.log('======================================');
_.forOwn(functions, function(obj, key) {
  console.log('[%s], v%s', key, obj.VERSION);
});

var config = require('./config');
var defaults = config.defaults;
var tasks = _.omit(config, 'defaults');
if (target) {
  var reg = new RegExp('^' + target + '$');
  tasks = _.pickBy(tasks, function(obj, name) {
    return reg.test(name) || reg.test(_.first(name.split(':')));
  });
}

async.eachSeries(tasks, function(task, name, done) {
  var avaiable = task.avaiable === undefined ? defaults.avaiable : task.avaiable;
  if (!avaiable) {
    return done();
  }
  var _count = count || _.get(task, 'count', defaults.count);
  var _times = times || _.get(task, 'times', defaults.times);
  var setup = _.get(task, 'setup', _.noop);

  setup(_count);

  console.log('======================================');
  console.log('[' + name + '] Comparating... ');

  var func = _.get(task, 'func', defaults.func);
  async.eachSeries(benchmarks, function(benchmarker, benchmark, next) {
    var funcs = _.mapValues(functions, function(async) {
      return function(callback) {
        func(async, callback);
      };
    });
    console.log('--------------------------------------');
    console.log('[%s] Executing...', benchmark);
    benchmarker(funcs, _times)(function(err, res) {
      if (err) {
        return next(err);
      }
      _.forEach(res, function(data, index, array) {
        var name = data.name;
        var mean = data.mean;
        var diff = (_.first(array).mean) / mean;
        console.log('[' + (++index) + ']', '"' + name + '"', (mean.toPrecision(3)) + 'μs' + '[' + diff.toPrecision(3) + ']');
      });
      next();
    });
  }, done);
});
