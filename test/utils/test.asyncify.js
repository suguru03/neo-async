/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');
var Q = require('q');

describe('#asyncify', function() {

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
      var d = Q.defer();
      d.resolve(test);
      return d.promise;
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
      var d = Q.defer();
      d.reject(new Error(message));
      return d.promise;
    };
    async.asyncify(func)(function(err) {
      assert.ok(err);
      assert.strictEqual(err.message, message);
      done();
    });
  });
});
