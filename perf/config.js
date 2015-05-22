'use strict';

var _ = require('lodash');

var collection, iterator;

module.exports = {
  defaults: {
    avaiable: false,
    count: 100,
    times: 100000,
    functions: ['async', 'neo-async_v0', 'neo-async_v1']
  },
  'each(array)': {
    times: 100000,
    setup: function(count) {
      collection = _.shuffle(_.times(count));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'each(object)': {
    avaiable: true,
    functions: ['neo-async_v0', 'neo-async_v1'],
    setup: function(count) {
      collection = _.mapValues(_.shuffle(_.times(count)));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  }
};
