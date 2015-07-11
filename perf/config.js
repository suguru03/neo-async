'use strict';

var _ = require('lodash');

var limit = 4;
var current = 0;
var concurrency = 1;
var collection, iterator, tasks, test, worker;

module.exports = {
  defaults: {
    avaiable: true,
    count: 100,
    times: 500000,
    functions: ['async', 'neo-async_v0', 'neo-async_v1']
  },
  'each:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'each:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'each:object:arg3': {
    functions: [0, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: {
      async: function(async, callback) {
        async.forEachOf(collection, iterator, callback); // not use only_once
      },
      'neo-async_v1': function(async, callback) {
        async.each(collection, iterator, callback);
      }
    }
  },
  'eachSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.eachSeries(collection, iterator, callback);
    }
  },
  'eachSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.eachSeries(collection, iterator, callback);
    }
  },
  'eachLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.eachLimit(collection, limit, iterator, callback);
    }
  },
  'eachLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.eachLimit(collection, limit, iterator, callback);
    }
  },
  'eachOf:array': {
    functions: [0, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachOf(collection, iterator, callback);
    }
  },
  'eachOf:object': {
    functions: [0, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachOf(collection, iterator, callback);
    }
  },
  'eachOfSeries:array': {
    functions: [0, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachOfSeries(collection, iterator, callback);
    }
  },
  'eachOfSeries:object': {
    functions: [0, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachOfSeries(collection, iterator, callback);
    }
  },
  'eachOfLimit:array': {
    functions: [0, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachOfLimit(collection, limit, iterator, callback);
    }
  },
  'eachOfLimit:object': {
    functions: [0, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachOfLimit(collection, limit, iterator, callback);
    }
  },
  'map:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.map(collection, iterator, callback);
    }
  },
  'map:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.map(collection, iterator, callback);
    }
  },
  'mapSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.mapSeries(collection, iterator, callback);
    }
  },
  'mapSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.mapSeries(collection, iterator, callback);
    }
  },
  'mapLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.mapLimit(collection, limit, iterator, callback);
    }
  },
  'mapLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.mapLimit(collection, limit, iterator, callback);
    }
  },
  'mapValues:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapValues(collection, iterator, callback);
    }
  },
  'mapValues:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapValues(collection, iterator, callback);
    }
  },
  'mapValuesSeries:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.mapValuesSeries(collection, iterator, callback);
    }
  },
  'mapValuesSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.mapValuesSeries(collection, iterator, callback);
    }
  },
  'mapValuesLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapValuesLimit(collection, limit, iterator, callback);
    }
  },
  'mapValuesLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapValuesLimit(collection, limit, iterator, callback);
    }
  },
  'filter:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(n % 2);
      };
    },
    func: function(async, callback) {
      async.filter(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filter:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(n % 2);
      };
    },
    func: function(async, callback) {
      async.filter(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterLimit(collection, 4, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'reject:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(n % 2);
      };
    },
    func: function(async, callback) {
      async.reject(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'reject:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(n % 2);
      };
    },
    func: function(async, callback) {
      async.reject(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'rejectSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'rejectSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'rejectLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'rejectLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'detect:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.detect(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'detect:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.detect(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'detectSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(false);
        });
      };
    },
    func: function(async, callback) {
      async.detectSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'detectSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(false);
        });
      };
    },
    func: function(async, callback) {
      async.detectSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'detectLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(false);
        });
      };
    },
    func: function(async, callback) {
      async.detectLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'detectLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(false);
        });
      };
    },
    func: function(async, callback) {
      async.detectLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'pick:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(n % 2);
      };
    },
    func: function(async, callback) {
      async.pick(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'pick:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(n % 2);
      };
    },
    func: function(async, callback) {
      async.pick(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'pickSeries:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.pickSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'pickSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.pickSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'pickLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.pickLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'pickLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.pickLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'reduce:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(result, n, callback) {
        process.nextTick(function() {
          callback(null, result + n);
        });
      };
    },
    func: function(async, callback) {
      async.reduce(collection, 0, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'reduce:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, callback) {
        process.nextTick(function() {
          callback(null, result + n);
        });
      };
    },
    func: function(async, callback) {
      async.reduce(collection, 0, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'reduceRight:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(result, n, callback) {
        process.nextTick(function() {
          callback(null, result + n);
        });
      };
    },
    func: function(async, callback) {
      async.reduceRight(collection, 0, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'reduceRight:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, callback) {
        process.nextTick(function() {
          callback(null, result + n);
        });
      };
    },
    func: function(async, callback) {
      async.reduceRight(collection, 0, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'transform:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        callback();
      };
    },
    func: function(async, callback) {
      async.transform(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'transform:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        callback();
      };
    },
    func: function(async, callback) {
      async.transform(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'transformSeries:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.transformSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'transformSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.transformSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'transformLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.transformLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'transformLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.transformLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'sortBy:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.sortBy(collection, iterator, callback);
    }
  },
  'sortBy:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.sortBy(collection, iterator, callback);
    }
  },
  'sortBySeries:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.sortBySeries(collection, iterator, callback);
    }
  },
  'sortBySeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.sortBySeries(collection, iterator, callback);
    }
  },
  'sortByLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.sortByLimit(collection, limit, iterator, callback);
    }
  },
  'sortByLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.sortByLimit(collection, limit, iterator, callback);
    }
  },
  'some:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.some(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'some:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.some(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'someSeries:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.someSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'someSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.someSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'someLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.someLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'someLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(false);
      };
    },
    func: function(async, callback) {
      async.someLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'every:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.every(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'every:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.every(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'everySeries:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(true);
        });
      };
    },
    func: function(async, callback) {
      async.everySeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'everySeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(true);
        });
      };
    },
    func: function(async, callback) {
      async.everySeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'everyLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.everyLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'everyLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.everyLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'concat:array': {
    times: 100000,
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.concat(collection, iterator, callback);
    }
  },
  'concat:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.concat(collection, iterator, callback);
    }
  },
  'concatSeries:array': {
    times: 100000,
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.concatSeries(collection, iterator, callback);
    }
  },
  'concatSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.concatSeries(collection, iterator, callback);
    }
  },
  'concatLimit:array': {
    times: 100000,
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.concatLimit(collection, limit, iterator, callback);
    }
  },
  'concatLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.concatLimit(collection, limit, iterator, callback);
    }
  },
  'parallel:array': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.parallel(tasks, callback);
    }
  },
  'parallel:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function() {
        return function(done) {
          done();
        };
      }));
    },
    func: function(async, callback) {
      async.parallel(tasks, callback);
    }
  },
  'series:array': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(next) {
          process.nextTick(next);
        };
      });
    },
    func: function(async, callback) {
      async.series(tasks, callback);
    }
  },
  'series:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function() {
        return function(next) {
          process.nextTick(next);
        };
      }));
    },
    func: function(async, callback) {
      async.series(tasks, callback);
    }
  },
  'parallelLimit:array': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(done) {
          process.nextTick(done);
        };
      });
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, limit, callback);
    }
  },
  'parallelLimit:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function() {
        return function(done) {
          process.nextTick(done);
        };
      }));
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, limit, callback);
    }
  },
  'waterfall:simple': {
    functions: [1, 2],
    setup: function(count) {
      tasks = _.times(count, function(n) {
        if (n === 0) {
          return function(done) {
            process.nextTick(function() {
              done(null, n);
            });
          };
        }
        return function(arg, done) {
          process.nextTick(function() {
            done(null, n);
          });
        };
      });
    },
    func: function(async, callback) {
      async.waterfall(tasks, callback);
    }
  },
  'waterfall:multiple': {
    setup: function(count) {
      var argMax = 10;
      tasks = _.times(count, function(n) {
        return function() {
          var done = _.last(arguments);
          var args = Array((arguments.length + 1) % argMax);
          if (args.length) {
            args[args.length - 1] = n;
            process.nextTick(function() {
              done.apply(null, args);
            });
          } else {
            process.nextTick(done);
          }
        };
      });
    },
    func: function(async, callback) {
      async.waterfall(tasks, callback);
    }
  },
  'angelFall:simple': {
    times: 10000,
    setup: function(count) {
      tasks = _.times(count, function(n) {
        if (n === 0) {
          return function(done) {
            done(null, n);
          };
        }
        return function(arg, done) {
          done(null, n);
        };
      });
    },
    func: {
      'default': function(async, callback) {
        async.waterfall(tasks, callback);
      },
      'neo-async_v1': function(async, callback) {
        async.angelFall(tasks, callback);
      }
    }
  },
  'whilst': {
    setup: function(count) {
      test = function() {
        return current++ < count;
      };
      iterator = function(callback) {
        callback();
      };
    },
    func: function(async, callback) {
      current = 0;
      async.whilst(test, iterator, callback);
    }
  },
  'doWhilst': {
    setup: function(count) {
      test = function() {
        return ++current < count;
      };
      iterator = function(callback) {
        callback();
      };
    },
    func: function(async, callback) {
      current = 0;
      async.doWhilst(iterator, test, callback);
    }
  },
  'until': {
    setup: function(count) {
      test = function() {
        return current++ === count;
      };
      iterator = function(callback) {
        callback();
      };
    },
    func: function(async, callback) {
      current = 0;
      async.until(test, iterator, callback);
    }
  },
  'doUntil': {
    setup: function(count) {
      test = function() {
        return current++ === count;
      };
      iterator = function(callback) {
        callback();
      };
    },
    func: function(async, callback) {
      current = 0;
      async.doUntil(iterator, test, callback);
    }
  },
  'during': {
    functions: [0, 2],
    setup: function(count) {
      test = function(callback) {
        callback(null, ++current < count);
      };
      iterator = function(callback) {
        callback();
      };
    },
    func: function(async, callback) {
      current = 0;
      async.during(test, iterator, callback);
    }
  },
  'doDuring': {
    functions: [0, 2],
    setup: function(count) {
      test = function(callback) {
        callback(null, ++current < count);
      };
      iterator = function(callback) {
        callback();
      };
    },
    func: function(async, callback) {
      current = 0;
      async.doDuring(iterator, test, callback);
    }
  },
  'forever': {
    setup: function(count) {
      iterator = function(callback) {
        callback(++current === count);
      };
    },
    func: function(async, callback) {
      current = 0;
      async.forever(iterator, function() {
        callback();
      });
    }
  },
  'compose': {
    setup: function(count) {
      tasks = _.times(count, function(n) {
        return function(sum, done) {
          done(null, sum + n);
        };
      });
    },
    func: function(async, callback) {
      async.compose.apply(async, tasks)(0, callback);
    }
  },
  'seq': {
    setup: function(count) {
      tasks = _.times(count, function(n) {
        return function(sum, done) {
          done(null, sum + n);
        };
      });
    },
    func: function(async, callback) {
      async.seq.apply(async, tasks)(0, callback);
    }
  },
  'applyEach': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(num, done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.applyEach(tasks, 0, callback);
    }
  },
  'applyEach:partial': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(num, done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.applyEach(tasks)(0, callback);
    }
  },
  'applyEachSeries': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(num, done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.applyEachSeries(tasks, 0, callback);
    }
  },
  'applyEachSeries:partial': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(num, done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.applyEachSeries(tasks, 0, callback);
    }
  },
  'queue': {
    times: 10000,
    setup: function() {
      worker = function(data, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      var q = async.queue(worker, concurrency);
      q.drain = function() {
        callback();
      };
      _.times(100, function(n) {
        q.push(n, function() {});
      });
    }
  },
  'priorityQueue': {
    times: 2000,
    setup: function() {
      worker = function(data, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      var q = async.priorityQueue(worker, concurrency);
      q.drain = function() {
        callback();
      };
      var max = 100;
      _.times(max, function(n) {
        q.push(n, max - n, function() {});
      });
    }
  }
};

function createArrayCollection(count) {
  return _.shuffle(_.times(count));
}

function createObjectCollection(count) {
  return _.mapValues(_.shuffle(_.times(count)));
}
