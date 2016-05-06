/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#race', function() {

  it('should call each funciton in parallel and callback with first result', function(done) {

    var called = 0;
    var tasks = _.times(10, function(index) {
      return function(next) {
        called++;
        next(null, index);
      };
    });
    async.race(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.strictEqual(called, 1);
      setImmediate(function() {
        assert.strictEqual(called, 10);
        done();
      });
    });
  });

  it('should callback funciton in parallel with object tasks', function(done) {

    var called = 0;
    var tasks = _.mapValues(_.times(5, function(index) {
      return function(next) {
        setTimeout(function() {
          called++;
          next(null, index);
        }, 50 - index * 5);
      };
    }));
    async.race(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 4);
    });
    setTimeout(function() {
      assert.strictEqual(called, 5);
      done();
    }, 100);
  });

  it('should callback with the first error', function(done) {

    var tasks = _.times(6, function(index) {
      return function(next) {
        setTimeout(function() {
          next(new Error('error:' + index), index);
        }, 50 - index * 5);
      };
    });
    async.race(tasks, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, 5);
      assert.strictEqual(err.message, 'error:5');
      done();
    });
  });

  it('should callback when task is empty', function(done) {

    async.race([], function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });
  });

  it('should return TypeError if first argument is not an array or an object', function(done) {

    async.race(null, function(err, res) {
      assert.ok(err);
      assert.ok(err instanceof TypeError);
      assert.strictEqual(res, undefined);
      done();
    });
  });

});
