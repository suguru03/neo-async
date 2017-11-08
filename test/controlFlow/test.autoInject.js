/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

parallel('#autoInject', function() {

  it('should execute by auto injection', function(done) {

    var order = [];
    async.autoInject({
      task1: function(task2, callback) {
        assert.strictEqual(task2, 2);
        setTimeout(function() {
          order.push('task1');
          callback(null, 1);
        }, delay);
      },
      task2: function(callback) {
        setTimeout(function() {
          order.push('task2');
          callback(null, 2);
        }, delay * 2);
      },
      task3: function(task2, callback) {
        assert.strictEqual(task2, 2);
        order.push('task3');
        callback(null, 3);
      },
      task4: function(task1, task2, callback) {
        assert.strictEqual(task1, 1);
        assert.strictEqual(task2, 2);
        order.push('task4');
        callback(null, 4);
      },
      task5: function(task2, callback) {
        assert.strictEqual(task2, 2);
        setTimeout(function() {
          order.push('task5');
          callback(null, 5);
        });
      },
      task6: function(task2, callback) {
        assert.strictEqual(task2, 2);
        order.push('task6');
        callback(null, 6);
      }
    }, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(result, {
        task1: 1,
        task2: 2,
        task3: 3,
        task4: 4,
        task5: 5,
        task6: 6
      });
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

  it('should work with array tasks', function(done) {

    var order = [];
    async.autoInject({
      task1: [function(callback) {
        order.push('task1');
        callback(null, 1);
      }],
      task2: ['task3', function(task3, callback) {
        assert.strictEqual(task3, 3);
        order.push('task2');
        callback(null, 2);
      }],
      task3: function(callback) {
        order.push('task3');
        callback(null, 3);
      }
    }, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(result, {
        task1: 1,
        task2: 2,
        task3: 3
      });
      assert.deepStrictEqual(order, [
        'task1',
        'task3',
        'task2'
      ]);
      done();
    });
  });

  it('should execute tasks', function(done) {

    var order = [];
    async.autoInject({
      task1: function(callback) {
        order.push('task1');
        callback(null, 1);
      },
      task2: ['task3', function(task3, callback) {
        order.push('task2');
        assert.strictEqual(task3, 3);
        callback(null, 2);
      }],
      task2_1: ['task3', function(arg1, callback) {
        order.push('task2_1');
        assert.strictEqual(arg1, 3);
        assert.ok(_.isFunction(callback));
        assert.strictEqual(arguments.length, 2);
        callback();
      }],
      task2_2: function(task3, callback) {
        order.push('task2_2');
        assert.strictEqual(task3, 3);
        callback();
      },
      task2_3: ['task1', 'task3', function(arg1, arg2, callback) {
        order.push('task2_3');
        assert.strictEqual(arg1, 1);
        assert.strictEqual(arg2, 3);
        callback();
      }],
      task2_4: ['task3', function(arg1, callback) {
        order.push('task2_4');
        assert.strictEqual(arg1, 3);
        callback();
      }],
      task3: function (callback) {
        order.push('task3');
        callback(null, 3);
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [
        'task1',
        'task3',
        'task2',
        'task2_1',
        'task2_2',
        'task2_3',
        'task2_4'
      ]);
      done();
    });
  });

  it('should execute complex tasks', function(done) {

    var order = [];
    async.autoInject({
      task1: ['task3', 'task2', 'task5', 'task6', function(arg1, arg2, arg3, arg4, callback) {
        order.push('task1');
        assert.strictEqual(arg1, 3);
        assert.strictEqual(arg2, 2);
        assert.strictEqual(arg3, 5);
        assert.strictEqual(arg4, 6);
        callback(null, 1);
      }],
      task2: function(task3, callback) {
        assert.strictEqual(task3, 3);
        order.push('task2');
        callback(null, 2);
      },
      task3: ['task5', function(arg1, callback) {
        assert.strictEqual(arg1, 5);
        order.push('task3');
        callback(null, 3);
      }],
      task4: function(task1, task2, task7, callback) {
        assert.strictEqual(task1, 1);
        assert.strictEqual(task2, 2);
        assert.strictEqual(task7, 7);
        order.push('task4');
        callback(null, 4);
      },
      task5: function(callback) {
        setTimeout(function() {
          order.push('task5');
          callback(null, 5);
        }, delay * 2);
      },
      task6: function(task7, callback) {
        assert.strictEqual(task7, 7);
        order.push('task6');
        callback(null, 6);
      },
      task7: function(callback) {
        setTimeout(function() {
          order.push('task7');
          callback(null, 7);
        }, delay);
      }
    }, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(result, {
        task1: 1,
        task2: 2,
        task3: 3,
        task4: 4,
        task5: 5,
        task6: 6,
        task7: 7
      });
      assert.deepStrictEqual(order, [
        'task7',
        'task6',
        'task5',
        'task3',
        'task2',
        'task1',
        'task4'
      ]);
      done();
    });
  });

  it('should throw an error if task argument length is zero', function() {

    var err;
    try {
      async.autoInject({
        task1: function() {
        },
        task2: function(task1, callback) {
          assert(false);
          callback();
        }
      });
    } catch(e) {
      err = e;
      assert.ok(e);
      assert.strictEqual(e.message, 'autoInject task functions require explicit parameters.');
    }
    assert.ok(err);
  });

  it('should throw an error if array task length is empty', function() {

    var err;
    try {
      async.autoInject({
        task1: [],
        task2: function(task1, callback) {
          callback();
        }
      });
    } catch(e) {
      err = e;
      assert.ok(e);
      assert.strictEqual(e.message, 'autoInject task functions require explicit parameters.');
    }
    assert.ok(err);
  });

  var arrowSupport = true;
  try {
    /* jshint -W054 */
    new Function('x => x');
    /* jshint +W054 */
  } catch (e) {
    arrowSupport = false;
  }

  if (arrowSupport) {
    // Needs to be run on ES6 only

    /* jshint -W061 */
    eval("(function() {                                             " +
       "  it('should work with es6 arrow syntax', function (done) { " +
       "    async.autoInject({                                      " +
       "      task1: (cb)           => cb(null, 1),                 " +
       "      task2: ( task3 , cb ) => cb(null, 2),                 " +
       "      task3: cb             => cb(null, 3)                  " +
       "    }, (err, results) => {                                  " +
       "      assert.deepStrictEqual(results, {                           " +
       "        task1: 1,                                           " +
       "        task2: 2,                                           " +
       "        task3: 3                                            " +
       "      });                                                   " +
       "      done();                                               " +
       "    });                                                     " +
       "  });                                                       " +
       "})                                                          "
    )();
    /* jshint +W061 */
  }

  var defaultSupport = true;

  try {
    eval('function x(y = 1){ return y }');
  }catch (e) {
    defaultSupport = false;
  }

  if(arrowSupport && defaultSupport) {
    // Needs to be run on ES6 only

    /* eslint {no-eval: 0}*/
    eval("(function() {                                                  " +
       "  it('should work with es6 obj method syntax', function (done) { " +
       "    async.autoInject({                                           " +
       "      task1 (cb) {            cb(null, 1) },                     " +
       "      task2 ( task3 , cb ) {  cb(null, 2) },                     " +
       "      task3 (cb) {            cb(null, 3) },                     " +
       "      task4 ( task2 , cb ) {  cb(null) },                        " +
       "      task5 ( task4 = 4 , cb ) { cb(null, task4 + 1) }           " +
       "    }, (err, results) => {                                       " +
       "      assert.strictEqual(results.task1, 1);                      " +
       "      assert.strictEqual(results.task3, 3);                      " +
       "      assert.strictEqual(results.task4, undefined);              " +
       "      assert.strictEqual(results.task5, 5);                      " +
       "      done();                                                    " +
       "    });                                                          " +
       "  });                                                            " +
       "})                                                               "
    )();
  }

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
    async.autoInject(tasks, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });
});
