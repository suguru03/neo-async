/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = global.async || require('../../');
var delay = require('../config').delay;
var domain = require('domain').create();
var errorCallCount = 0;
domain.on('error', function(err) {
  errorCallCount++;
  assert.strictEqual(err.message, 'Callback was already called.');
});

function createSimpleTasks(numbers) {

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

describe('#angelFall', function() {

  it('should execute to waterfall by collection of array', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createSimpleTasks(numbers);
    async.angelFall(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 10);
      done();
    });
  });

  it('should execute simple tasks', function(done) {

    var numbers = [1, 3, 2, 4, 7, 8, 6, 5];
    var tasks = createSimpleTasks(numbers);
    async.angelFall(tasks, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(result, 36);
      done();
    });
  });

  it('should execute example tasks', function(done) {
    var order = [];
    var tasks = [
      function(next) {
        setTimeout(function() {
          order.push(1);
          next(null, 1);
        }, 10);
      },
      function(arg1, empty, next) {
        setTimeout(function() {
          order.push(2);
          next(null, 1, 2);
        }, 30);
      },
      function(next) {
        setTimeout(function() {
          order.push(3);
          next(null, 3);
        }, 20);
      },
      function(arg1, empty1, empty2, empty3, next) {
        setTimeout(function() {
          order.push(4);
          next(null, 1, 2, 3, 4);
        }, 40);
      }
    ];
    async.angelFall(tasks, function(err, arg1, arg2, arg3, arg4) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(arg1, 1);
      assert.strictEqual(arg2, 2);
      assert.strictEqual(arg3, 3);
      assert.strictEqual(arg4, 4);
      done();
    });
  });

  it('should execute complex tasks', function(done) {

    var tasks = [
      function(next) {
        next(null, 1);
      },
      function(arg1, next) {
        next(null, arg1, 2);
      },
      function(arg1, arg2, empty, next) {
        next(null, arg1, arg2, 3);
      },
      function(arg1, arg2, arg3, empty1, empty2, empty3, empty4, next) {
        next(null, arg1, arg2, arg3, 4);
      },
      function(arg1, next) {
        next(null, arg1, 2, 3, 4, 5);
      },
      function(next) {
        next(null, 1, 2, 3, 4, 5, 6, 7, 8);
      },
      function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, empty, next) {
        next(null, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, empty, next);
      }
    ];
    async.angelFall(tasks, function(err, a, b, c, d, e, f, g, h, empty) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(a, 1);
      assert.strictEqual(b, 2);
      assert.strictEqual(c, 3);
      assert.strictEqual(d, 4);

      assert.strictEqual(e, 5);
      assert.strictEqual(f, 6);
      assert.strictEqual(g, 7);
      assert.strictEqual(h, 8);

      assert.strictEqual(empty, undefined);

      done();
    });
  });

  it('should execute with asynchronous', function(done) {

    var order = [];
    async.angelFall([
      function(next) {
        order.push(1);
        setImmediate(next);
        order.push(2);
      },
      function(next) {
        order.push(3);
        setImmediate(next);
      }
    ], function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should throw error', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createSimpleTasks(numbers);
    var errorTask = function(res, next) {
      next('error');
    };
    tasks.splice(2, 0, errorTask);

    async.angelFall(tasks, function(err) {
      assert.ok(err);
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
      async.angelFall(array);
    });

    setTimeout(function() {
      assert.strictEqual(errorCallCount, 1);
      done();
    }, delay);
  });

  it('should throw error if task is not collection', function(done) {

    async.angelFall(null, function(err) {
      assert.strictEqual(err.message, 'First argument to waterfall must be an array of functions');
      done();
    });
  });

  it('should throw error with binding', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createSimpleTasks(numbers);
    var errorTask = function(res, next) {
      next('error');
    };
    tasks.splice(2, 0, errorTask);

    async.angelFall(tasks, function(err) {
      assert.ok(err);
      done();
    }, Math);
  });

  it('should return response immediately if array task is empty', function(done) {

    var tasks = [];
    async.angelFall(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });
  });

});
