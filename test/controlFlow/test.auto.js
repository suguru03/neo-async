/* global it */
'use strict';

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;

parallel('#auto', function() {

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

    async.auto(tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, ['task2', 'task6', 'task3', 'task5', 'task1', 'task4']);
      done();
    });
  });

  it('should execute in accordance with best order and get results', function(done) {

    var order = [];

    async.auto({
      task1: ['task2', function(callback, results) {
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
      task3: ['task2', function(callback, results) {
        assert.strictEqual(results.task2, 'task2');
        order.push('task3');
        callback();
      }],
      task4: ['task1', 'task2', function(callback, results) {
        assert.deepEqual(results.task1, ['task1a', 'task1b']);
        assert.strictEqual(results.task2, 'task2');
        order.push('task4');
        callback(null, 'task4');
      }]
    }, function(err, results) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, ['task2', 'task3', 'task1', 'task4']);
      assert.deepEqual(results, {
        task1: ['task1a', 'task1b'],
        task2: 'task2',
        task3: undefined,
        task4: 'task4'
      });
      done();
    });
  });

  it('should execute even if object is empty', function(done) {

    async.auto({}, done);
  });

  it('should execute without callback', function(done) {

    async.auto({
      task1: function(callback) {
        callback();
      },
      task2: ['task1', function(callback) {
        callback();
        done();
      }]
    });
  });

  it('should throw error and get safe results', function(done) {

    var order = [];

    async.auto({
      task1: ['task2', function(callback, results) {
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
      task3: ['task2', function(callback, results) {
        assert.strictEqual(results.task2, 'task2');
        order.push('task3');
        callback('error', 'task3');
      }],
      task4: ['task1', 'task2', function(callback, results) {
        assert.deepEqual(results.task1, ['task1a', 'task1b']);
        assert.strictEqual(results.task2, 'task2');
        order.push('task4');
        callback(null, 'task4');
      }]
    }, function(err, results) {
      assert.ok(err);
      assert.deepEqual(order, ['task2', 'task3']);
      assert.deepEqual(results, {
        task2: 'task2',
        task3: 'task3'
      });
      done();
    });
  });

  it('should execute in limited by concurrency', function(done) {
    var order = [];
    var tasks = {
      task1: function(callback) {
        order.push('task1');
        callback();
      },
      task2: ['task1', function(callback) {
        setTimeout(function() {
          order.push('task2');
          callback();
        }, delay * 2);
      }],
      task3: ['task1', function(callback) {
        setTimeout(function() {
          order.push('task3');
          callback();
        }, delay * 2);
      }],
      task4: ['task1', function(callback) {
        setTimeout(function() {
          order.push('task4');
          callback();
        }, delay * 1);
      }],
      task5: ['task1', function(callback) {
        setTimeout(function() {
          order.push('task5');
          callback();
        }, delay * 1);
      }],
      task6: ['task1', function(callback) {
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
      assert.deepEqual(order, [
        'task1',
        'task2',
        'task3',
        'task6',
        'task5',
        'task4'
      ]);
      done();
    });
  });

});
