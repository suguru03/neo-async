/* global it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;

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
      assert.deepEqual(result, {
        task1: 1,
        task2: 2,
        task3: 3,
        task4: 4,
        task5: 5,
        task6: 6
      });
      assert.deepEqual(order, [
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
      task1: function(callback) {
        order.push('task1');
        callback(null, 1);
      },
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
      assert.deepEqual(result, {
        task1: 1,
        task2: 2,
        task3: 3
      });
      assert.deepEqual(order, [
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
      task2_1: ['task3', function(callback) {
        order.push('task2_1');
        assert.ok(_.isFunction(callback));
        assert.strictEqual(arguments.length, 1);
        callback();
      }],
      task2_2: function(task3, callback) {
        order.push('task2_2');
        assert.strictEqual(task3, 3);
        callback();
      },
      task2_3: ['task1', 'task3', function(task3, task1, callback) {
        order.push('task2_3');
        assert.strictEqual(task1, 1);
        assert.strictEqual(task3, 3);
        callback();
      }],
      task2_4: ['task3', function(task1, callback) {
        order.push('task2_4');
        assert.strictEqual(task1, 1);
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
      assert.deepEqual(order, [
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
      task1: ['task3', 'task2', function(callback) {
        order.push('task1');
        callback(null, 1);
      }],
      task2: function(task3, callback) {
        assert.strictEqual(task3, 3);
        order.push('task2');
        callback(null, 2);
      },
      task3: ['task5', function(task6, callback) {
        assert.strictEqual(task6, 6);
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
      },
      task8: function() {
        order.push('task8');
        return 8;
      }
    }, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(result, {
        task1: 1,
        task2: 2,
        task3: 3,
        task4: 4,
        task5: 5,
        task6: 6,
        task7: 7,
        task8: 8
      });
      assert.deepEqual(order, [
        'task8',
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

});
