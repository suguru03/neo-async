'use strict';

var _ = require('lodash');

var limit = 4;
var current = 0;
var concurrency = 1;
var collection, iterator, tasks, test, worker, func, times;

module.exports = {
  defaults: {
    avaiable: true,
    count: 100,
    times: 500000
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
  'each:set': {
    setup: function(count) {
      collection = createSetCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'each:map': {
    setup: function(count) {
      collection = createMapCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
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
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, key, callback) {
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.eachOfSeries(collection, iterator, callback);
    }
  },
  'eachOfSeries:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, key, callback) {
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.eachOfSeries(collection, iterator, callback);
    }
  },
  'eachOfLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, key, callback) {
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      async.eachOfLimit(collection, limit, iterator, callback);
    }
  },
  'eachOfLimit:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, key, callback) {
        process.nextTick(callback);
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
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, k, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapValues(collection, iterator, callback);
    }
  },
  'mapValues:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, k, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapValues(collection, iterator, callback);
    }
  },
  'mapValuesSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, k, callback) {
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
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, k, callback) {
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
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, k, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.mapValuesLimit(collection, limit, iterator, callback);
    }
  },
  'mapValuesLimit:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, k, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
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
        callback(null, n % 2);
      };
    },
    func: function(async, callback) {
      async.filter(collection, iterator, callback);
    }
  },
  'filter:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n % 2);
      };
    },
    func: function(async, callback) {
      async.filter(collection, iterator, callback);
    }
  },
  'filterSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterSeries(collection, iterator, callback);
    }
  },
  'filterSeries:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterSeries(collection, iterator, callback);
    }
  },
  'filterLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterLimit(collection, limit, iterator, callback);
    }
  },
  'filterLimit:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.filterLimit(collection, limit, iterator, callback);
    }
  },
  'reject:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n % 2);
      };
    },
    func: function(async, callback) {
      async.reject(collection, iterator, callback);
    }
  },
  'reject:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n % 2);
      };
    },
    func: function(async, callback) {
      async.reject(collection, iterator, callback);
    }
  },
  'rejectSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectSeries(collection, iterator, callback);
    }
  },
  'rejectSeries:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectSeries(collection, iterator, callback);
    }
  },
  'rejectLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectLimit(collection, limit, iterator, callback);
    }
  },
  'rejectLimit:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n % 2);
        });
      };
    },
    func: function(async, callback) {
      async.rejectLimit(collection, limit, iterator, callback);
    }
  },
  'detect:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, false);
      };
    },
    func: function(async, callback) {
      async.detect(collection, iterator, callback);
    }
  },
  'detect:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, false);
      };
    },
    func: function(async, callback) {
      async.detect(collection, iterator, callback);
    }
  },
  'detectSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, false);
        });
      };
    },
    func: function(async, callback) {
      async.detectSeries(collection, iterator, callback);
    }
  },
  'detectSeries:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, false);
        });
      };
    },
    func: function(async, callback) {
      async.detectSeries(collection, iterator, callback);
    }
  },
  'detectLimit:array': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, false);
        });
      };
    },
    func: function(async, callback) {
      async.detectLimit(collection, limit, iterator, callback);
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
      async.reduce(collection, 0, iterator, callback);
    }
  },
  'reduce:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, callback) {
        process.nextTick(function() {
          callback(null, result + n);
        });
      };
    },
    func: function(async, callback) {
      async.reduce(collection, 0, iterator, callback);
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
      async.reduceRight(collection, 0, iterator, callback);
    }
  },
  'reduceRight:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, callback) {
        process.nextTick(function() {
          callback(null, result + n);
        });
      };
    },
    func: function(async, callback) {
      async.reduceRight(collection, 0, iterator, callback);
    }
  },
  'transform:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        callback();
      };
    },
    func: function(async, callback) {
      async.transform(collection, iterator, callback);
    }
  },
  'transform:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(result, n, index, callback) {
        result[index] = n;
        callback();
      };
    },
    func: function(async, callback) {
      async.transform(collection, iterator, callback);
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
  'some:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, false);
      };
    },
    func: function(async, callback) {
      async.some(collection, iterator, callback);
    }
  },
  'some:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, false);
      };
    },
    func: function(async, callback) {
      async.some(collection, iterator, callback);
    }
  },
  'someSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, false);
        });
      };
    },
    func: function(async, callback) {
      async.someSeries(collection, iterator, callback);
    }
  },
  'someSeries:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, false);
        });
      };
    },
    func: function(async, callback) {
      async.someSeries(collection, iterator, callback);
    }
  },
  'someLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, false);
        });
      };
    },
    func: function(async, callback) {
      async.someLimit(collection, limit, iterator, callback);
    }
  },
  'someLimit:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, false);
        });
      };
    },
    func: function(async, callback) {
      async.someLimit(collection, limit, iterator, callback);
    }
  },
  'every:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, true);
      };
    },
    func: function(async, callback) {
      async.every(collection, iterator, callback);
    }
  },
  'every:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, true);
      };
    },
    func: function(async, callback) {
      async.every(collection, iterator, callback);
    }
  },
  'everySeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, true);
        });
      };
    },
    func: function(async, callback) {
      async.everySeries(collection, iterator, callback);
    }
  },
  'everySeries:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, true);
        });
      };
    },
    func: function(async, callback) {
      async.everySeries(collection, iterator, callback);
    }
  },
  'everyLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, true);
        });
      };
    },
    func: function(async, callback) {
      async.everyLimit(collection, limit, iterator, callback);
    }
  },
  'everyLimit:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, true);
        });
      };
    },
    func: function(async, callback) {
      async.everyLimit(collection, limit, iterator, callback);
    }
  },
  'concat:array': {
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
      async.concat(collection, iterator, callback);
    }
  },
  'concat:object': {
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        process.nextTick(function() {
          callback(null, n);
        });
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
  'parallel:array': {
    setup: function(count) {
      tasks = _.times(count, function(n) {
        return function(done) {
          done(null, n);
        };
      });
    },
    func: function(async, callback) {
      async.parallel(tasks, callback);
    }
  },
  'parallel:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function(n) {
        return function(done) {
          process.nextTick(function() {
            done(null, n);
          });
        };
      }));
    },
    func: function(async, callback) {
      async.parallel(tasks, callback);
    }
  },
  'series:array': {
    setup: function(count) {
      tasks = _.times(count, function(n) {
        return function(next) {
          process.nextTick(function() {
            next(null, n);
          });
        };
      });
    },
    func: function(async, callback) {
      async.series(tasks, callback);
    }
  },
  'series:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function(n) {
        return function(next) {
          process.nextTick(function() {
            next(null, n);
          });
        };
      }));
    },
    func: function(async, callback) {
      async.series(tasks, callback);
    }
  },
  'parallelLimit:array': {
    setup: function(count) {
      tasks = _.times(count, function(n) {
        return function(done) {
          process.nextTick(function() {
            done(null, n);
          });
        };
      });
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, limit, callback);
    }
  },
  'parallelLimit:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function(n) {
        return function(done) {
          process.nextTick(function() {
            done(null, n);
          });
        };
      }));
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, limit, callback);
    }
  },
  'waterfall:simple': {
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
  'whilst': {
    setup: function(count) {
      test = function() {
        return current++ < count;
      };
      iterator = function(callback) {
        process.nextTick(callback);
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
        process.nextTick(callback);
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
        process.nextTick(callback);
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
        process.nextTick(callback);
      };
    },
    func: function(async, callback) {
      current = 0;
      async.doUntil(iterator, test, callback);
    }
  },
  'during': {
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
  'apply': {
    setup: function() {
      func = function(arg1, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.apply(func, 1)(callback);
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
    times: 1000,
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
      _.times(1000, function(n) {
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
  },
  'times': {
    setup: function(count) {
      times = count;
      iterator = function(n, done) {
        done(null, n);
      };
    },
    func: function(async, callback) {
      async.times(times, iterator, callback);
    }
  },
  'timesSeries': {
    setup: function(count) {
      times = count;
      iterator = function(n, done) {
        process.nextTick(function() {
          done(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.timesSeries(times, iterator, callback);
    }
  },
  'timesLimit': {
    setup: function(count) {
      times = count;
      iterator = function(n, done) {
        process.nextTick(function() {
          done(null, n);
        });
      };
    },
    func: function(async, callback) {
      async.timesLimit(times, limit, iterator, callback);
    }
  },
  'auto': {
    setup: function() {
      tasks = {
        task1: ['task2', function(results, callback) {
          callback();
        }],
        task2: ['task3', function(results, callback) {
          callback();
        }],
        task3: ['task5', function(results, callback) {
          callback();
        }],
        task4: ['task1', 'task2', 'task3', 'task5', 'task6', 'task7', function(results, callback) {
          callback();
        }],
        task5: function(callback) {
          callback();
        },
        task6: ['task7', function(results, callback) {
          callback();
        }],
        task7: function(callback) {
          callback();
        }
      };
    },
    func: function(async, callback) {
      async.auto(tasks, callback);
    }
  }
};

function createArrayCollection(count) {
  return _.shuffle(_.times(count));
}

function createObjectCollection(count) {
  return _.mapValues(_.shuffle(_.times(count)));
}

function createSetCollection(count) {
  var set = new Set();
  _.forOwn(createArrayCollection(count), function(v) {
    set.add(v);
  });
  return set;
}

function createMapCollection(count) {
  var map = new Map();
  _.forOwn(createObjectCollection(count), function(v, k) {
    map.set(k, v);
  });
  return map;
}
