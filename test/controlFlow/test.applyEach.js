/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var util = require('../util');

parallel('#applyEach', function() {

  it('should execute in parallel', function(done) {

    var order = [];
    var one = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(1);
        cb(null, 1);
      }, 100);
    };
    var two = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(2);
        cb(null, 2);
      }, 50);
    };
    var three = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(3);
        cb(null, 3);
      }, 150);
    };

    async.applyEach([one, two, three], 5, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [2, 1, 3]);
      assert.deepStrictEqual(res, [1, 2, 3]);
      done();
    });

  });

  it('should execute as a partial apprication', function(done) {

    var order = [];
    var one = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(1);
        cb(null, 1);
      }, 100);
    };
    var two = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(2);
        cb(null, 2);
      }, 50);
    };
    var three = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(3);
        cb(null, 3);
      }, 150);
    };

    async.applyEach([one, two, three])(5, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [2, 1, 3]);
      assert.deepStrictEqual(res, [1, 2, 3]);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    var tasks = _.times(3, function(n) {
      return function(val, callback) {
        try {
          callback(val + n);
        } catch(exception) {
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
    async.applyEach(tasks, 5, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

});

parallel('#applyEachSeries', function() {

  it('should execute in series', function(done) {

    var order = [];
    var one = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(1);
        cb(null, 1);
      }, 100);
    };
    var two = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(2);
        cb(null, 2);
      }, 50);
    };
    var three = function(val, cb) {
      assert.equal(val, 5);
      setTimeout(function() {
        order.push(3);
        cb(null, 3);
      }, 150);
    };

    async.applyEachSeries([one, two, three], 5, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 2, 3]);
      assert.deepStrictEqual(res, [1, 2, 3]);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    var tasks = _.times(3, function(n) {
      return function(val, callback) {
        try {
          callback(val + n);
        } catch(exception) {
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
    async.applyEachSeries(tasks, 5, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });
});
