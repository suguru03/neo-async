/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#seq', function() {

  it('should execute in order of insertion', function(done) {

    var add2 = function(n, cb) {
      assert.strictEqual(n, 3);
      setTimeout(function() {
        cb(null, n + 2);
      }, 50);
    };

    var mul3 = function(n, cb) {
      assert.strictEqual(n, 5);
      setTimeout(function() {
        cb(null, n * 3);
      }, 15);
    };

    var add1 = function(n, cb) {
      assert.strictEqual(n, 15);
      setTimeout(function() {
        cb(null, n + 1);
      }, 100);
    };

    var add2mul3add1 = async.seq(add2, mul3, add1);

    add2mul3add1(3, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 16);
      done();
    });

  });

  it('should execute in order of insertion with binding', function(done) {

    var pow2 = function(n, cb) {
      var self = this;
      assert.strictEqual(n, 3);
      setTimeout(function() {
        cb(null, self.pow(n, 2));
      }, 50);
    };

    var mul3 = function(n, cb) {
      assert.strictEqual(n, 9);
      setTimeout(function() {
        cb(null, n * 3);
      }, 15);
    };

    var pow3 = function(n, cb) {
      var self = this;
      assert.strictEqual(n, 27);
      setTimeout(function() {
        cb(null, self.pow(n, 3));
      }, 100);
    };

    var add2mul3add1 = async.seq(pow2, mul3, pow3);

    add2mul3add1.call(Math, 3, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 19683);
      done();
    });

  });

  it('should throw error', function(done) {

    var add2 = function(n, cb) {
      assert.strictEqual(n, 3);
      setTimeout(function() {
        cb(null, n + 2);
      }, 50);
    };

    var mul3 = function(n, cb) {
      assert.strictEqual(n, 5);
      setTimeout(function() {
        cb(new Error('error'));
      }, 15);
    };

    var add1 = function(n, cb) {
      setTimeout(function() {
        cb(null, n + 1);
      }, 100);
    };

    var add2mul3add1 = async.seq(add2, mul3, add1);

    add2mul3add1(3, function(err) {
      assert.ok(err);
      done();
    });

  });

});
