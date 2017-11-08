/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#during', function() {

  it('should execute until asynchronous test is false', function(done) {

    var order = [];
    var count = 0;
    var test = function(callback) {
      order.push(['test', count]);
      callback(null, count < 5);
    };
    var iterator = function(callback) {
      order.push(['iterator', count]);
      count++;
      setTimeout(function() {
        callback();
      }, 10);
    };
    async.during(test, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(count, 5);
      assert.deepStrictEqual(order, [
        ['test', 0],
        ['iterator', 0],
        ['test', 1],
        ['iterator', 1],
        ['test', 2],
        ['iterator', 2],
        ['test', 3],
        ['iterator', 3],
        ['test', 4],
        ['iterator', 4],
        ['test', 5]
      ]);
      done();
    });
  });

  it('should execute without binding until asynchronous test is false', function(done) {

    var count = 0;
    var sum = 0;
    var test = function(callback) {
      callback(null, count < 5);
    };
    var iterator = function(callback) {
      count++;
      sum += this && this.num || 3;
      setTimeout(function() {
        callback();
      }, 10);
    };
    async.during(test, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(count, 5);
      assert.strictEqual(sum, 15);
      done();
    }, {
      num: 2
    });
  });

  it('should throw error if error occurs in test', function(done) {

    var count = 0;
    var test = function(callback) {
      callback(new Error('error'));
    };
    var iterator = function(callback) {
      count++;
      callback();
    };
    async.during(test, iterator, function(err) {
      assert.ok(err);
      assert.strictEqual(count, 0);
      done();
    });
  });

  it('should throw error if error occurs in iterator', function(done) {

    var count = 0;
    var test = function(callback) {
      callback(null, count < 5);
    };
    var iterator = function(callback) {
      count++;
      callback(new Error('error'));
    };
    async.during(test, iterator, function(err) {
      assert.ok(err);
      assert.strictEqual(count, 1);
      done();
    });
  });

});

parallel('#doDuring', function() {

  it('should execute until asynchronous test is false', function(done) {

    var order = [];
    var count = 0;
    var test = function(callback) {
      order.push(['test', count]);
      callback(null, count < 5);
    };
    var iterator = function(callback) {
      order.push(['iterator', count]);
      count++;
      setTimeout(function() {
        callback();
      }, 10);
    };
    async.doDuring(iterator, test, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(count, 5);
      assert.deepStrictEqual(order, [
        ['iterator', 0],
        ['test', 1],
        ['iterator', 1],
        ['test', 2],
        ['iterator', 2],
        ['test', 3],
        ['iterator', 3],
        ['test', 4],
        ['iterator', 4],
        ['test', 5]
      ]);
      done();
    });
  });

  it('should execute with binding until asynchronous test is false', function(done) {

    var order = [];
    var count = 0;
    var sum = 0;
    var test = function(callback) {
      order.push(['test', count]);
      callback(null, count < 5);
    };
    var iterator = function(callback) {
      order.push(['iterator', count]);
      count++;
      sum += this && this.num || 3;
      setTimeout(function() {
        callback();
      }, 10);
    };
    async.doDuring(iterator, test, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(count, 5);
      assert.strictEqual(sum, 15);
      assert.deepStrictEqual(order, [
        ['iterator', 0],
        ['test', 1],
        ['iterator', 1],
        ['test', 2],
        ['iterator', 2],
        ['test', 3],
        ['iterator', 3],
        ['test', 4],
        ['iterator', 4],
        ['test', 5]
      ]);
      done();
    }, {
      num: 2
    });
  });

  it('should execute with some arguments', function(done) {

    var order = [];
    var count = 0;
    var test = function() {
      order.push(['test', count]);
      if (count % 2) {
        assert.strictEqual(arguments.length, 2);
      } else {
        assert.strictEqual(arguments.length, 3);
      }
      var callback = _.slice(arguments).pop();
      callback(null, count < 5);
    };
    var iterator = function(callback) {
      order.push(['iterator', count]);
      count++;
      setTimeout(function() {
        if (count % 2) {
          callback(null, 1);
        } else {
          callback(null, 1, 2);
        }
      }, 10);
    };
    async.doDuring(iterator, test, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [
        ['iterator', 0],
        ['test', 1],
        ['iterator', 1],
        ['test', 2],
        ['iterator', 2],
        ['test', 3],
        ['iterator', 3],
        ['test', 4],
        ['iterator', 4],
        ['test', 5]
      ]);
      done();
    });
  });

  it('should throw error if error occurs in test', function(done) {

    var count = 0;
    var test = function(callback) {
      callback(new Error('error'));
    };
    var iterator = function(callback) {
      count++;
      callback();
    };
    async.doDuring(iterator, test, function(err) {
      assert.ok(err);
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('should throw error if error occurs in iterator', function(done) {

    var count = 0;
    var test = function(callback) {
      callback(null, count < 5);
    };
    var iterator = function(callback) {
      count++;
      callback(new Error('error'));
    };
    async.doDuring(iterator, test, function(err) {
      assert.ok(err);
      assert.strictEqual(count, 1);
      done();
    });
  });

});
