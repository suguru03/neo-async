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

        order.push(num);
        if (self && self.round) {
          num = self.round(num);
        }
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
    tasks.push(function(cb) {
      setTimeout(function() {
        order.push(5);
        cb(null, 5, 5);
      }, 50);
    });

    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4, 8, [5, 5]]);
      assert.deepEqual(order, [1, 3, 2, 4, 5]);
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
      assert.deepEqual(res, {
        a: 8,
        b: 4,
        c: 2,
        d: 6
      });
      assert.deepEqual(order, [4, 2, 1, 3]);
      done();
    });

  });

  it('should execute to series by tasks of array with binding', function(done) {

    var order = [];
    var numbers = [1.2, 2.4, 1.5, 3.6];
    var tasks = createTasks(order, numbers);

    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 4, 4, 8]);
      assert.deepEqual(order, [1.2, 2.4, 1.5, 3.6]);
      done();
    }, Math);

  });

  it('should execute to series by tasks of object with binding', function(done) {

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
      assert.deepEqual(res, {
        a: 2,
        c: 4,
        b: 4,
        d: 8
      });
      assert.deepEqual(order, [1.2, 2.4, 1.5, 3.6]);
      done();
    }, Math);

  });

  it('should return response immediately if array task is empty', function(done) {

    var tasks = [];
    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object task is empty', function(done) {

    var tasks = {};
    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      done();
    });

  });

  it('should return response immediately if task is not collection', function(done) {

    async.series('test', function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });

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

  it('should throw error if double callback', function(done) {

    var tasks = [function(next) {
      next();
      next();
    }];

    try {
      async.series(tasks);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

});
