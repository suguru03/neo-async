/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#tryEach', function() {

  it('should execute', function(done) {

    var result = 'test';
    async.tryEach([
      function(callback) {
        callback(null, result);
      }
    ], function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, result);
      done();
    });
  });

  it('should execute with object', function(done) {

    var result = 'test';
    async.tryEach({
      task1: function(callback) {
        callback(null, result);
      },
      task2: function() {
        assert(false);
      }
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, result);
      done();
    });
  });

  it('should return multiple arguments', function(done) {

    var results = ['arg1', 'arg2'];
    async.tryEach([
      function(callback) {
        callback(null, results[0], results[1]);
      }
    ], function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, results);
      done();
    });
  });

  it('should execute second task if first task is failed', function(done) {

    async.tryEach([
      function(callback) {
        callback(new Error('failed'), 'task1');
      },
      function(callback) {
        callback(null, 'task2');
      }
    ], function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 'task2');
      done();
    });

  });

  it('should return an error if all tasks are failed', function(done) {

    async.tryEach([
      function(callback) {
        callback(new Error('failed1'), 'task1');
      },
      function(callback) {
        callback(new Error('failed2'), 'task2');
      }
    ], function(err) {
      assert.ok(err);
      assert.strictEqual(err.message, 'failed2');
      done();
    });
  });

  it('should not cause any error if task is empty', function(done) {

    async.tryEach([], function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });
  });

  it('should not cause any error if task is string', function(done) {

    async.tryEach('test', function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });
  });
});
