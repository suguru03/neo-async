'use strict';

var _ = require('lodash');
var Comparator = require('func-comparator').Comparator;

module.exports = function(funcs, times) {

  return function(callback) {
    new Comparator()
      .set(funcs)
      .async()
      .times(times)
      .start()
      .result(function(err, res) {
        if (err) {
          return callback(err);
        }
        var result = _.chain(res)
          .map(function(data, name) {
            return {
              name: name,
              mean: data.average
            };
          })
          .sortBy('mean')
          .value();

        callback(null, result);
      });
  };
};
