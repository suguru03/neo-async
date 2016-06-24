/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = require('../../');
var delay = require('../config').delay;
var util = require('../util');

parallel('#asyncify', function() {

  it('should convert synchronous function into asynchronous', function(done) {

    var test = {
      hoge: true
    };
    var func = function() {
      return test;
    };
    async.asyncify(func)(function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, test);
      done();
    });
  });

  it('should convert promise synchronous function', function(done) {

    var test = {
      hoge: true
    };
    var func = function() {
      return util.Promise.resolve(test);
    };
    async.asyncify(func)(function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, test);
      done();
    });
  });

  it('should throw error', function(done) {

    var message = 'error';
    var func = function() {
      throw new Error(message);
    };
    async.asyncify(func)(function(err) {
      assert.ok(err);
      assert.strictEqual(err.message, message);
      done();
    });
  });

  it('should throw error by promise', function(done) {

    var message = 'error';
    var func = function() {
      return util.Promise.reject(new Error(message));
    };
    async.asyncify(func)(function(err) {
      assert.ok(err);
      assert.strictEqual(err.message, message);
      done();
    });
  });

  it('should avoid TypeError if return object is null', function(done) {

    var func = function() {
      return null;
    };
    async.asyncify(func)(function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, null);
      done();
    });
  });

  it('should throw an error if reject is called', function(done) {

    var func = function(arg) {
      return util.Promise.reject(arg + ' rejected');
    };
    async.asyncify(func)('argument', function(err) {
      assert.ok(err);
      assert.strictEqual(err.message, 'argument rejected');
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var count = 0;
    var msg = 'error in callback';
    process.once('unhandledRejection', function(err) {
      assert.ok(err);
      assert.strictEqual(err.message, msg);
    });
    var promisified = function(arg) {
      return new util.Promise(function(resolve) {
        resolve(arg + ' resolved');
      });
    };
    async.asyncify(promisified)('arg', function(err, res) {
      count++;
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 'arg resolved');
      setTimeout(function() {
        assert.strictEqual(count, 1);
        done();
      }, delay);
      throw new Error(msg);
    });
  });

});
