/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

parallel('#auto', function() {

  it('should execute in accordance with best order', function(done) {

    var order = [];
    var tasks = {
      task1: ['task2', function(results, callback) {
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
      task3: ['task2', function(results, callback) {
        order.push('task3');
        callback();
      }],
      task4: ['task1', 'task2', function(results, callback) {
        order.push('task4');
        callback();
      }],
      task5: ['task2', function(results, callback) {
        setTimeout(function() {
          order.push('task5');
          callback();
        }, 0);
      }],
      task6: ['task2', function(results, callback) {
        order.push('task6');
        callback();
      }]
    };

    async.auto(tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [
        'task2',
        'task3',
        'task6',
        'task5',
        'task1',
        'task4'
      ]);
      done();
    });
  });

  it('should execute in accordance with best order and get results', function(done) {

    var order = [];

    async.auto({
      task1: ['task2', function(results, callback) {
        assert.strictEqual(results.task2, 'task2');
        setTimeout(function() {
          order.push('task1');
          callback(null, 'task1a', 'task1b');
        }, 25);
      }],
      task2: function(callback) {
        setTimeout(function() {
          order.push('task2');
          callback(null, 'task2');
        });
      },
      task3: ['task2', function(results, callback) {
        assert.strictEqual(results.task2, 'task2');
        order.push('task3');
        callback();
      }],
      task4: ['task1', 'task2', function(results, callback) {
        assert.deepStrictEqual(results.task1, ['task1a', 'task1b']);
        assert.strictEqual(results.task2, 'task2');
        order.push('task4');
        callback(null, 'task4');
      }]
    }, function(err, results) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, ['task2', 'task3', 'task1', 'task4']);
      assert.deepStrictEqual(results, {
        task1: ['task1a', 'task1b'],
        task2: 'task2',
        task3: undefined,
        task4: 'task4'
      });
      done();
    });
  });

  it('should execute even if array task dosen\'t have nay dependencies', function(done) {

    var order = [];
    async.auto({
      task1: function(callback) {
        order.push('task1');
        callback(null, 'task1');
      },
      task2: ['task3', function(task3, callback) {
        order.push('task2');
        callback(null, 'task2');
      }],
      task3: [function(callback) {
        order.push('task3');
        callback(null, 'task3');
      }]
    }, function(err, results) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [
        'task1',
        'task3',
        'task2'
      ]);
      assert.deepStrictEqual(results, {
        task1: 'task1',
        task2: 'task2',
        task3: 'task3'
      });
      done();
    });
  });

  it('should execute even if object is empty', function(done) {

    async.auto({}, done);
  });

  it('should execute without callback', function(done) {

    var tasks = {
      task1: function(callback) {
        callback();
      },
      task2: ['task1', function(results, callback) {
        callback();
      }]
    };
    async.auto(tasks);
    setTimeout(done, delay);
  });

  it('should execute without callback', function(done) {

    var tasks = {
      task1: function(callback) {
        callback();
      },
      task2: ['task1', function(results, callback) {
        callback();
      }]
    };
    async.auto(tasks, 1);
    setTimeout(done, delay);
  });

  it('should throw error and get safe results', function(done) {

    var order = [];

    async.auto({
      task1: ['task2', function(results, callback) {
        assert.strictEqual(results.task2, 'task2');
        setTimeout(function() {
          order.push('task1');
          callback(null, 'task1a', 'task1b');
        }, 25);
      }],
      task2: function(callback) {
        setTimeout(function() {
          order.push('task2');
          callback(null, 'task2');
        });
      },
      task3: ['task2', function(results, callback) {
        assert.strictEqual(results.task2, 'task2');
        order.push('task3');
        callback('error', 'task3');
      }],
      task4: ['task1', 'task2', function(results, callback) {
        assert.deepStrictEqual(results.task1, ['task1a', 'task1b']);
        assert.strictEqual(results.task2, 'task2');
        order.push('task4');
        callback(null, 'task4');
      }]
    }, function(err, results) {
      assert.ok(err);
      assert.deepStrictEqual(order, ['task2', 'task3']);
      assert.deepStrictEqual(results, {
        task2: 'task2',
        task3: 'task3'
      });
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    var tasks = {
      task1: function(callback) {
        try {
          callback('error');
        } catch(exception) {
          try {
            callback(exception);
          } catch(e) {
            assert.ok(e);
            util.errorChecker(e);
          }
          done();
        }
      }
    };
    async.auto(tasks, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should execute in limited by concurrency', function(done) {
    var order = [];
    var tasks = {
      task1: function(callback) {
        order.push('task1');
        callback();
      },
      task2: ['task1', function(results, callback) {
        setTimeout(function() {
          order.push('task2');
          callback();
        }, delay * 2);
      }],
      task3: ['task1', function(results, callback) {
        setTimeout(function() {
          order.push('task3');
          callback();
        }, delay * 2);
      }],
      task4: ['task1', function(results, callback) {
        setTimeout(function() {
          order.push('task4');
          callback();
        }, delay * 1);
      }],
      task5: ['task1', function(results, callback) {
        setTimeout(function() {
          order.push('task5');
          callback();
        }, delay * 1);
      }],
      task6: ['task1', function(results, callback) {
        setTimeout(function() {
          order.push('task6');
          callback();
        }, delay * 1);
      }]
    };
    async.auto(tasks, 2, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [
        'task1',
        'task2',
        'task3',
        'task4',
        'task5',
        'task6'
      ]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        done();
      })
      .run(function() {
        async.auto({
          task1: function(callback) {
            setImmediate(function() {
              callback();
              callback();
            });
          },
          task2: function(callback) {
            callback();
          }
        });
      });
  });

  it('should stop execution if a synchronous error occur', function(done) {

    async.auto({
      task1: function(callback) {
        callback('error');
      },
      task2: function(callback) {
        assert.ok(false);
        callback();
      }
    }, 1, function(err) {
      assert.strictEqual(err, 'error');
      setTimeout(done, delay);
    });
  });

  it('should avoid unnecessary deferrals', function(done) {

    var sync = true;
    async.auto({
      task1: function(callback) {
        callback(null, 1);
      },
      task2: ['task1', function(results, callback) {
        callback();
      }]
    }, function(err) {
      if (err) {
        return done(err);
      }
      assert.ok(sync);
      done();
    });
    sync = false;
  });

  it('auto prevent dead-locks due to inexistant dependencies', function() {

    var err;
    try {
      async.auto({
        task1: ['noexist', function(results, callback) {
          callback(null, 'task1');
        }]
      });
    } catch(e) {
      err = e;
      assert.ok(e);
      assert(/^async.auto task `task1` has non-existent dependency/.test(e.message));
    }
    assert.ok(err);
  });

  it('auto prevent dead-locks due to all cyclic dependencies', function() {

    var err;
    try {
      async.auto({
        task1: ['task2', function(results, callback) {
          callback(null, 'task1');
        }],
        task2: ['task1', function(results, callback) {
          callback(null, 'task2');
        }]
      });
    } catch(e) {
      err = e;
      assert.ok(e);
      assert.strictEqual(e.message, 'async.auto task has cyclic dependencies');
    }
    assert.ok(err);
  });

  it('auto prevent dead-locks due to some cyclic dependencies', function() {

    var err;
    try {
      async.auto({
        task1: ['task2', function(results, callback) {
          callback(null, 'task1');
        }],
        task2: ['task1', function(results, callback) {
          callback(null, 'task2');
        }],
        task3: function(callback) {
          callback(null, 'task3');
        },
        task4: ['task5', function(results, callback) {
          callback(null, 'task4');
        }],
        task5: ['task4', function(results, callback) {
          callback(null, 'task5');
        }]
      });
    } catch(e) {
      err = e;
      assert.ok(e);
      assert.strictEqual(e.message, 'async.auto task has cyclic dependencies');
    }
    assert.ok(err);
  });

  it('should throw an error if tasks have cyclic dependencies', function() {

    var err;
    var task = function(name) {
      return function(results, callback) {
        callback(null, 'task ' + name);
      };
    };
    try {
      async.auto({
        a: ['c', task('a')],
        b: ['a', task('b')],
        c: ['b', task('c')]
      });
    } catch(e) {
      err = e;
      assert.ok(e);
      assert.strictEqual(e.message, 'async.auto task has cyclic dependencies');
    }
    assert.ok(err);
  });

  it('should work even if reserved name is included', function(done) {
    // var async = require('async');
    var tasks = {
      one: function(next) {
        next(null, 1);
      },
      hasOwnProperty: function(next) {
        next(null, 2);
      }
    };
    async.auto(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        one: 1,
        hasOwnProperty: 2
      });
      done();
    });
  });

  /**
   * @see https://github.com/suguru03/neo-async/issues/57
   */
  it('should work without cyclic dependencies error', function(done) {
    var error = new Error('error');
    async.auto({
        task1: function(callback) {
            setTimeout(callback, delay, error);
        },
        task2: function(callback) {
            setTimeout(callback, delay * 2)
        },
        task3: ['task1', 'task2', function(callback) {
            setTimeout(callback, delay * 2)
        }]
    }, function(err) {
      assert.strictEqual(err, error);
      setTimeout(done, delay * 3);
    });
  });
});
