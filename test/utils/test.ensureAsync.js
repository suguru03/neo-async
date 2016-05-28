/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#ensureAsync', function() {

  it('should call function on asynchronous even if funcion is called on synchronous', function(done) {

    var sync = true;
    var func = function(callback) {
      callback();
    };
    async.ensureAsync(func)(function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });

  it('should call asynchronous function', function(done) {

    var sync = true;
    var func = function(callback) {
      setImmediate(callback);
    };
    async.ensureAsync(func)(function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });

  it('should bind context', function(done) {

    var func = function(callback) {
      callback(this);
    };
    var newFunc = async.ensureAsync(func);
    newFunc = newFunc.bind(Math);
    newFunc(function(res) {
      assert.strictEqual(res, Math);
      done();
    });
  });

  it('should not override the bound context of function', function(done) {

    var func = function(callback) {
      callback(this);
    };
    var newFunc = func.bind(Math);
    newFunc = async.ensureAsync(newFunc);
    newFunc(function(res) {
      assert.strictEqual(res, Math);
      done();
    });
  });
});
