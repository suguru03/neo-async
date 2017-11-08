/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

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
      }, num * delay);
    };
  });
}

parallel('#series', function() {

  it('should execute to series by tasks of array', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);
    tasks.push(function(cb) {
      setTimeout(function() {
        order.push(5);
        cb(null, 5, 5);
      }, delay * 5);
    });

    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [2, 6, 4, 8, [5, 5]]);
      assert.deepStrictEqual(order, [1, 3, 2, 4, 5]);
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
      assert.deepStrictEqual(res, {
        a: 8,
        b: 4,
        c: 2,
        d: 6
      });
      assert.deepStrictEqual(order, [4, 2, 1, 3]);
      done();
    });
  });

  it('should execute to series by tasks of array without binding', function(done) {

    var order = [];
    var numbers = [1.2, 2.4, 1.5, 3.6];
    var tasks = createTasks(order, numbers);

    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [2.4, 4.8, 3, 7.2]);
      assert.deepStrictEqual(order, [1.2, 2.4, 1.5, 3.6]);
      done();
    }, Math);
  });

  it('should execute to series by tasks of object without binding', function(done) {

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
      assert.deepStrictEqual(res, {
        a: 2.4,
        b: 4.8,
        c: 3,
        d: 7.2
      });
      assert.deepStrictEqual(order, [1.2, 2.4, 1.5, 3.6]);
      done();
    }, Math);
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var numbers = [1, 3, 2, 4];
    var tasks = _.map(numbers, function(n) {
      return function(next) {
        next(null, n);
      };
    });
    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(res, [1, 3, 2, 4]);
      done();
    });
    sync = false;
  });

  it('should return response immediately if array task is empty', function(done) {

    var tasks = [];
    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object task is empty', function(done) {

    var tasks = {};
    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {});
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
        var tasks = [function(next) {
          process.nextTick(next);
          process.nextTick(next);
        }];
        async.series(tasks);
      });
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
    async.series(tasks, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

});
