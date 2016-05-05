'use strict';

var _ = require('lodash');
var Benchmark = require('benchmark');

module.exports = function(funcs) {

  return function(callback) {
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

    suite
      .on('complete', function() {
        var result = _.chain(this)
          .map(function(data) {
            var name = data.name;
            var time = total[name];
            return {
              name: name,
              mean: time.time / time.count
            };
          })
          .sortBy('mean')
          .value();
        callback(null, result);
      })
      .run({
        async: true
      });
  };
};
