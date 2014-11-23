/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var asyncjs = require('async');
var timer = require('../util').createTimer();

function createTasks(type, numbers) {

  switch(type) {
  case 'simple':
    return createSimpleTasks();
  case 'complex':
    return createComplexTasks();
  }

  function createSimpleTasks() {

    var first = true;
    var tasks = _.transform(numbers, function(memo, num, key) {

      if (first) {
        first = false;
        memo[key] = function(done) {
          done(null, num);
        };
      } else {
        memo[key] = function(sum, done) {
          done(null, sum + num);
        };
      }
    });

    return tasks;
  }

  function createComplexTasks() {

    var count = 0;
    var tasks = _.transform(numbers, function(memo, num, key) {

      if (count++ === 0) {
        memo[key] = function(done) {
          done(null, num);
        };
      } else {
        memo[key] = function() {
          var args = _.toArray(arguments);
          var done = args.pop();
          args.unshift(null);
          args.push(num);
          done.apply(null, args);
        };
      }
    });

    return tasks;
  }


}

describe('#waterfall', function() {


  it('should execute to waterfall by collection of array', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createTasks('simple', numbers);
    async.waterfall(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.equal(res, 10);
      done();
    });

  });

  it('should execute to waterfall by collection of object', function(done) {

    var numbers = {
      a: 3,
      b: 4,
      d: 2,
      c: 5
    };
    var tasks = createTasks('simple', numbers);
    async.waterfall(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.equal(res, 14);
      done();
    });

  });

  it('should execute to waterfall by collection of array', function(done) {

    var numbers = [1, 3, 2, 4];
    var tasks = createTasks('complex', numbers);
    async.waterfall(tasks, function(err, a, b, c, d) {
      if (err) {
        return done(err);
      }
      assert.equal(a, 1);
      assert.equal(b, 3);
      assert.equal(c, 2);
      assert.equal(d, 4);
      done();
    });

  });

  it('should execute faster than async.js', function(done) {

    var sample = 1000;
    var collection = _.sample(_.times(sample), sample);
    var sum = _.reduce(collection, function(sum, num) {
      return sum + num;
    }, 0);
    var tasks = createTasks('simple', collection);

    var result = {
      async: {},
      asyncjs: {}
    };

    // async
    timer.init().start();
    async.waterfall(tasks, function(err, res1) {
      if (err) {
        return done(err);
      }

      result.async.time = timer.diff();
      timer.init().start();

      // asyncjs
      asyncjs.waterfall(tasks, function(err, res2) {
        if (err) {
          return done(err);
        }

        result.asyncjs.time = timer.diff();

        // result
        assert.equal(sum, res1);
        assert.equal(sum, res2);
        assert.ok(result.async.time < result.asyncjs.time);

        done();
      });
    });
  });

});

