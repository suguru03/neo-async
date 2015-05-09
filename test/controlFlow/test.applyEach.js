/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = global.async || require('../../');

describe('#applyEach', function() {

  it('should execute in parallel', function(done) {

    var order = [];

    var one = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(1);
        cb();
      }, 100);
    };

    var two = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(2);
        cb();
      }, 50);
    };

    var three = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(3);
        cb();
      }, 150);
    };

    async.applyEach([one, two, three], 5, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [2, 1, 3]);
      done();
    });

  });

  it('should execute as a partial apprication', function(done) {

    var order = [];

    var one = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(1);
        cb();
      }, 100);
    };

    var two = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(2);
        cb();
      }, 50);
    };

    var three = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(3);
        cb();
      }, 150);
    };

    async.applyEach([one, two, three])(5, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [2, 1, 3]);
      done();
    });

  });

});

describe('#applyEachSeries', function() {

  it('should execute in series', function(done) {

    var order = [];

    var one = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(1);
        cb();
      }, 100);
    };

    var two = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(2);
        cb();
      }, 50);
    };

    var three = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(3);
        cb();
      }, 150);
    };

    async.applyEachSeries([one, two, three], 5, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

});
