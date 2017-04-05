/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function createTasks(type, numbers) {

  switch (type) {
    case 'simple':
      return createSimpleTasks();
    case 'complex':
      return createComplexTasks();
  }

  function createSimpleTasks() {

    var first = true;
    var tasks = _.transform(numbers, function(memo, num, key) {
      if (first) {
        first = false;
        memo[key] = function(done) {
          if (this === Math) {
            num *= 2;
          }
          done(null, num);
        };
      } else {
        memo[key] = function(sum, done) {
          if (this === Math) {
            num *= 2;
          }
          done(null, sum + num);
        };
      }
    });
    return tasks;
  }

  function createComplexTasks() {

    var count = 0;
    var tasks = _.transform(numbers, function(memo, num, key) {
      if (count++ === 0) {
        memo[key] = function(done) {
          if (this === Math) {
            num *= 2;
          }
          done(null, num);
        };
      } else {
        memo[key] = function() {
          if (this === Math) {
            num *= 2;
          }
          var args = _.toArray(arguments);
          var done = args.pop();
          args.unshift(null);
          args.push(num);
          done.apply(null, args);
        };
      }
    });
    return tasks;
  }

}

parallel('#waterfall', function() {

  it('should execute to waterfall by collection of array', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createTasks('simple', numbers);
    async.waterfall(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 10);
      done();
    });
  });

  it('should execute simple tasks', function(done) {

    var numbers = [1, 3, 2, 4, 7, 8, 6, 5];
    var tasks = createTasks('simple', numbers);
    async.waterfall(tasks, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(result, 36);
      done();
    });
  });

  it('should execute complex tasks', function(done) {

    var numbers = [1, 3, 2, 4, 7, 8, 6, 5];
    var tasks = createTasks('complex', numbers);
    async.waterfall(tasks, function(err, a, b, c, d, e, f, g, h) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(a, 1);
      assert.strictEqual(b, 3);
      assert.strictEqual(c, 2);
      assert.strictEqual(d, 4);

      assert.strictEqual(e, 7);
      assert.strictEqual(f, 8);
      assert.strictEqual(g, 6);
      assert.strictEqual(h, 5);

      done();
    });
  });

  it('should throw error', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createTasks('simple', numbers);
    var errorTask = function(res, next) {
      next('error');
    };
    tasks.splice(2, 0, errorTask);

    async.waterfall(tasks, function(err) {
      assert.ok(err);
      done();
    });
  });

  it('should throw error if callback is called twice', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 1);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
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
        async.waterfall(array);
      });
  });

  it('should throw error if task is not collection', function(done) {

    async.waterfall(null, function(err) {
      assert.strictEqual(err.message, 'First argument to waterfall must be an array of functions');
      done();
    });
  });

  it('should throw error with binding', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createTasks('simple', numbers);
    var errorTask = function(res, next) {
      next('error');
    };
    tasks.splice(2, 0, errorTask);

    async.waterfall(tasks, function(err) {
      assert.ok(err);
      done();
    }, Math);
  });

  it('should avoid double callback', function(done) {

    var called = false;
    var tasks = _.times(3, function(n) {
      return function(callback) {
        try {
          callback('error' + n);
        } catch (exception) {
          try {
            callback(exception);
          } catch(e) {
            assert.ok(e);
            util.errorChecker(e);
          }
          done();
        }
      };
    });
    async.waterfall(tasks, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if array task is empty', function(done) {

    var tasks = [];
    async.waterfall(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });
  });

  it('multiple callback calls (trickier) @nodeonly', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 1);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        async.waterfall([
          function(callback) {
            setTimeout(callback, 0, null, 'one', 'two');
            setTimeout(callback, 10, null, 'one', 'two');
          },
          function(arg1, arg2, callback) {
            setTimeout(callback, 15, null, arg1, arg2, 'three');
          }
        ], function () {
          throw new Error('should not get here');
        });
      });
  });

});
