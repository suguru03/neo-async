/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var asyncjs = require('async');
var timer = require('../util').createTimer();

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

describe('#parallel', function() {

  it('should execute in parallel by tasks of array', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);

    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4, 8]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute in parallel by tasks of object', function(done) {

    var order = [];
    var numbers = {
      a: 4,
      b: 2,
      c: 1,
      d: 3
    };
    var tasks = createTasks(order, numbers);

    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { c: 2, b: 4, d: 6, a: 8 });
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute in parallel with binding', function(done) {

    var order = [];
    var numbers = {
      a: 1.2,
      b: 2.4,
      c: 1.5,
      d: 3.6
    };
    var tasks = createTasks(order, numbers);

    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { a: 2, c: 4, b: 4, d: 8 });
      assert.deepEqual(order, [1, 2, 2, 4]);
      done();
    }, Math);
  });

  it('should execute faster than async.js', function(done) {

    var sample = 1000;
    var collection = _.sample(_.times(sample), sample);
    var tasks = _.map(collection, function(item) {
      return function(callback) {
        callback(null, item);
      };
    });

    var result = {
      async: {},
      asyncjs: {}
    };

    // asyncjs
    timer.init().start();
    async.parallel(tasks, function(err, res1) {
      if (err) {
        return done(err);
      }

      result.async.time = timer.diff();
      timer.init().start();

      // async
      asyncjs.parallel(tasks, function(err, res2) {
        if (err) {
          return done(err);
        }

        result.asyncjs.time = timer.diff();

        // result
        assert.deepEqual(collection, res1);
        assert.deepEqual(collection, res2);
        assert.ok(result.async.time < result.asyncjs.time);

        done();
      });
    });

  });

});

describe('#parallelLimit', function() {

  it('should execute in limited by tasks of array', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);

    async.parallelLimit(tasks, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4, 8]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute in limited by tasks of object', function(done) {

    var order = [];
    var numbers = {
      a: 4,
      b: 2,
      c: 1,
      d: 3
    };
    var tasks = createTasks(order, numbers);

    async.parallelLimit(tasks, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { b: 4, a: 8, c: 2, d: 6 });
      assert.deepEqual(order, [2, 4, 1, 3]);
      done();
    });
  });

  it('should execute in parallel with binding', function(done) {

    var order = [];
    var numbers = {
      a: 1.2,
      b: 2.4,
      c: 1.5,
      d: 3.6
    };
    var tasks = createTasks(order, numbers);

    async.parallelLimit(tasks, 3, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { a: 2, c: 4, b: 4, d: 8 });
      assert.deepEqual(order, [1, 2, 2, 4]);
      done();
    }, Math);
  });

  it('should execute faster than async.js', function(done) {

    var sample = 1000;
    var limit = 5;
    var collection = _.sample(_.times(sample), sample);
    var tasks = _.map(collection, function(item) {
      return function(callback) {
        callback(null, item);
      };
    });

    var result = {
      async: {
        sum: 0
      },
      asyncjs: {
        sum: 0
      }
    };

    // asyncjs
    var now = _.now();
    asyncjs.parallelLimit(tasks, limit, function(err, res1) {
      if (err) {
        return done(err);
      }

      result.asyncjs.time = _.now() - now;

      now = _.now();

      // async
      async.parallelLimit(tasks, 4, function(err, res2) {
        if (err) {
          return done(err);
        }

        result.async.time = _.now() - now;

        // result
        assert.deepEqual(collection, res1);
        assert.deepEqual(collection, res2);
        assert.ok(result.async.time < result.asyncjs.time);

        done();
      });
    });
  });

});

