/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');

function createTasks(order, numbers) {

  return _.transform(numbers, function(memo, num, index) {

    memo[index] = function(callback) {

      var self = this;

      setTimeout(function() {

        if (self && self.round) {
          num = self.round(num);
        }
        order.push(num);
        callback(null, num * 2);
      }, num * 10);
    };
  });
}

describe('#series', function() {

  it('should execute to series by tasks of array', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);

    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4, 8]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });

  });

  it('should execute to series by tasks of object', function(done) {

    var order = [];
    var numbers = {
      a: 4,
      b: 2,
      c: 1,
      d: 3
    };
    var tasks = createTasks(order, numbers);

    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { a: 8, b: 4, c: 2, d: 6 });
      assert.deepEqual(order, [4, 2, 1, 3]);
      done();
    });

  });

  it('should execute parallel with binding', function(done) {

    var order = [];
    var numbers = {
      a: 1.2,
      b: 2.4,
      c: 1.5,
      d: 3.6
    };
    var tasks = createTasks(order, numbers);

    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { a: 2, c: 4, b: 4, d: 8 });
      assert.deepEqual(order, [1, 2, 2, 4]);
      done();
    }, Math);

  });

  it('should throw error', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);
    var errorTask = function(next) {
      next('error');
    };
    tasks.splice(2, 0, errorTask);

    async.series(tasks, function(err) {
      assert.ok(err);
      done();
    });

  });

});

