/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

// TODO test...
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

    async.auto(tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, ['task2', 'task6', 'task3', 'task5', 'task1', 'task4']);
      done();
    });

  });

});

