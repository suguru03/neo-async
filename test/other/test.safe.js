/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../').safe;
var safeAsync = async === async.noConflict() ? async.safe : async;

var delay = require('../config').delay;
var domain = require('domain').create();
var errorCallCount = 0;
domain.on('error', function(err) {
  errorCallCount++;
  assert.strictEqual(err.message, 'Callback was already called.');
});

describe('#safe', function() {

  describe('#each', function() {

    it('should execute safe iterator many times', function(done) {

      var called = 0;
      var sum = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(num, done) {
        sum += num;
        called++;
        done();
      };
      safeAsync.each(array, syncIterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

    it('should execute safe iterator when iterator has extra arguments', function(done) {

      var called = 0;
      var times = 100;
      var array = _.times(times);
      var iterator = function(num, done, arg3, arg4, arg5, arg6) {
        called++;
        assert.strictEqual(arg3, undefined);
        assert.strictEqual(arg4, undefined);
        assert.strictEqual(arg5, undefined);
        assert.strictEqual(arg6, undefined);
        done();
      };
      safeAsync.each(array, iterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        done();
      });
    });

  });

  describe('#eachSeries', function() {

    it('should execute sync iterator many times', function(done) {

      var called = 0;
      var sum = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(num, done) {
        sum += num;
        called++;
        done();
      };
      safeAsync.eachSeries(array, syncIterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

  });

  describe('#reduce', function() {

    it('should execute sync iterator many times', function(done) {

      var called = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(result, num, done) {
        called++;
        done(null, result + num);
      };
      safeAsync.reduce(array, 0, syncIterator, function(err, sum) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

    it('should execute sync iterator with passing index many times', function(done) {

      var called = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(result, num, index, done) {
        called++;
        done(null, result + num);
      };
      safeAsync.reduce(array, 0, syncIterator, function(err, sum) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

  });

  describe('#transformLimit', function() {

    it('should execute iterator in limited by collection of array', function(done) {

      var called = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(result, num, index, done) {
        called++;
        result[index] = num;
        done();
      };
      safeAsync.transformLimit(array, 2, syncIterator, function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.deepEqual(array, res);
        done();
      });
    });

  });

  describe('#parallel', function() {

    it('should execute sync tasks many times', function(done) {

      var called = 0;
      var times = 100000;
      var tasks = {};
      _.times(times, function(n) {
        tasks[n] = function(done) {
          called++;
          done();
        };
      });
      safeAsync.parallel(tasks, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        done();
      });
    });
  });

  describe('#parallelLimit', function() {

    it('should execute sync tasks many times', function(done) {

      var called = 0;
      var times = 100000;
      var tasks = {};
      _.times(times, function(n) {
        tasks[n] = function(done) {
          called++;
          done();
        };
      });
      safeAsync.parallelLimit(tasks, 4, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        done();
      });
    });
  });

  describe('#series', function() {

    it('should execute sync tasks many times', function(done) {

      var called = 0;
      var times = 100000;
      var tasks = _.times(times, function() {
        return function(done) {
          called++;
          done();
        };
      });
      safeAsync.series(tasks, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        done();
      });
    });

  });

  describe('#whilst', function() {

    it('should execute until test is false', function(done) {

      var count = 0;
      var called = 0;
      var limit = 10;
      var test = function() {
        return ++count <= limit;
      };
      var iterator = function(callback) {
        called++;
        callback();
      };

      async.whilst(test, iterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(count, limit + 1);
        assert.strictEqual(called, limit);
        done();
      });
    });

  });

  describe('#auto', function() {

    it('should execute in accordance with best order', function(done) {

      var order = [];
      var tasks = {
        task1: ['task2', function(callback) {
          setTimeout(function() {
            order.push('task1');
            callback();
          }, 25);
        }],
        task2: function(callback) {
          setTimeout(function() {
            order.push('task2');
            callback();
          }, 50);
        },
        task3: ['task2', function(callback) {
          order.push('task3');
          callback();
        }],
        task4: ['task1', 'task2', function(callback) {
          order.push('task4');
          callback();
        }],
        task5: ['task2', function(callback) {
          setTimeout(function() {
            order.push('task5');
            callback();
          }, 0);
        }],
        task6: ['task2', function(callback) {
          order.push('task6');
          callback();
        }]
      };

      safeAsync.auto(tasks, function(err) {
        if (err) {
          return done(err);
        }
        assert.deepEqual(order, ['task2', 'task6', 'task3', 'task5', 'task1', 'task4']);
        done();
      });
    });
  });

  describe('#waterfall', function() {

    it('should execute tasks', function(done) {

      var tasks = [
        function(next) {
          next(null, next);
        },
        function(next) {
          next(null, 1, next);
        },
        function(arg1, next) {
          next(null, arg1, 2, next);
        },
        function(arg1, arg2, next) {
          next(null, arg1, arg2, 3, next);
        },
        function(arg1, arg2, arg3, next) {
          next(null, arg1, arg2, arg3, 4, next);
        },
        function(arg1, arg2, arg3, arg4, next) {
          next(null, arg1, arg2, arg3, arg4, 5, next);
        },
        function(arg1, arg2, arg3, arg4, arg5, next) {
          next(null, arg1, arg2, arg3, arg4, arg5, 6, next);
        },
        function(arg1, arg2, arg3, arg4, arg5, arg6, next) {
          next(null, arg1, arg2, arg3, arg4, arg5, arg6, 7, next);
        },
        function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, next) {
          next(null, arg1, arg2, arg3, arg4, arg5, arg6, arg7, 8, next);
        }
      ];
      safeAsync.waterfall(tasks, function(err) {
        if (err) {
          return done(err);
        }
        var args = _.slice(arguments);
        _.times(tasks.length, function(index) {
          if (index === 0) {
            return;
          }
          assert.strictEqual(index, args[index]);
        });
        done();
      });
    });

    it('should throw error', function(done) {

      var order = [];
      var tasks = [
        function(next) {
          order.push(1);
          next();
        },
        function(next) {
          order.push(2);
          next(new Error('error'));
        },
        function(next) {
          order.push(3);
          next();
        }
      ];
      safeAsync.waterfall(tasks, function(err, res) {
        assert.ok(err);
        assert.strictEqual(res, undefined);
        assert.deepEqual(order, [1, 2]);
        done();
      });
    });

    it('should throw error if callback is called twice', function(done) {

      errorCallCount = 0;
      domain.run(function() {
        var array = [
          function(next) {
            setImmediate(function() {
              next(null, 'one', 'two');
            });
            setImmediate(function() {
              next(null, 'one', 'two');
            });
          },

          function(arg1, arg2, next) {
            next(null, arg1, arg2, 'three');
          },

          function(arg1, arg2, arg3, next) {
            next(null, 'four');
          },

          function(arg1, next) {
            next();
          }
        ];
        safeAsync.waterfall(array);
      });

      setTimeout(function() {
        assert.strictEqual(errorCallCount, 1);
        done();
      }, delay);
    });

    it('should throw error if task is not collection', function(done) {

      safeAsync.waterfall(null, function(err) {
        assert.strictEqual(err.message, 'First argument to waterfall must be an array of functions');
        done();
      });
    });

    it('should return response immediately if array task is empty', function(done) {

      var tasks = [];
      safeAsync.waterfall(tasks, function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(res, undefined);
        done();
      });
    });

  });

  describe('#forever', function() {

    it('should execute until error occurs', function(done) {

      var count = 0;
      var limit = 5;
      var order = [];
      var iterator = function(callback) {
        order.push(count++);
        if (count === limit) {
          return callback(new Error('end'));
        }
        callback();
      };

      safeAsync.forever(iterator, function(err) {
        assert.ok(err);
        assert.deepEqual(order, [0, 1, 2, 3, 4]);
        done();
      });
    });
  });

  describe('#safe', function() {

    it('should create new safe function', function() {
      var safe = safeAsync.safe();
      assert.notStrictEqual(safeAsync, safe);
      assert.deepEqual(_.keys(safeAsync), _.keys(safe));
    });
  });

});
