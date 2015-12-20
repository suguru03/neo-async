'use strict';

var path = require('path');

var _ = require('lodash');
var Comparator = require('func-comparator').Comparator;

var async = require('../../');
var functions = {
  'async': require('async'),
  'neo-async_pre': require('neo-async'),
  'neo-async_current': async
};

console.log('--------------------------------------');
_.forEach(functions, function(async, key) {
  var version = async.VERSION;
  if (!version) {
    var p = path.resolve(__dirname, '../../', 'node_modules', key, 'package.json');
    version = _.get(require(p), 'version');
  }
  console.log('[' + key + '] v' + version);
});

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
  var times = task.times || defaults.times;
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

  console.log('--------------------------------------');
  console.log('[' + name + '] Comparating... ', useFunctions);
  new Comparator()
    .set(funcs)
    .async()
    .times(times)
    .start()
    .result(function(err, res) {
      _.chain(res)
        .map(function(data, name) {
          return {
            name: name,
            mean: data.average
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
    });
});
