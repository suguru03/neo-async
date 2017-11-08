/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#forever', function() {

  it('should execute until error occurs', function(done) {

    var count = 0;
    var limit = 5;
    var order = [];
    var iterator = function(callback) {
      order.push(count++);
      if (count === limit) {
        return callback(new Error('end'));
      }
      callback();
    };

    async.forever(iterator, function(err) {
      assert.ok(err);
      assert.deepStrictEqual(order, [0, 1, 2, 3, 4]);
      done();
    });
  });

  it('should execute without binding until error occurs', function(done) {

    var count = 0;
    var limit = 5;
    var order = [];
    var result = [];
    var iterator = function(callback) {
      assert.strictEqual(this, undefined);
      result.push(count * count);
      order.push(count++);
      if (count === limit) {
        return callback(new Error('end'));
      }
      callback();
    };

    async.forever(iterator, function(err) {
      assert.ok(err);
      assert.deepStrictEqual(order, [0, 1, 2, 3, 4]);
      assert.deepStrictEqual(result, [0, 1, 4, 9, 16]);
      done();
    }, Math);
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var count = 0;
    var limit = 5;
    var iterator = function(callback) {
      if (count++ === limit) {
        return callback(new Error('end'));
      }
      callback();
    };
    async.forever(iterator, function(err) {
      assert.ok(err);
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var count = 0;
    var limit = 5;
    var order = [];
    var iterator = function(callback) {
      order.push(count++);
      if (count === limit) {
        return callback(new Error('end'));
      }
      callback();
    };
    domain.create()
      .on('error', function(err) {
        assert.strictEqual(err.message, 'end');
        assert.deepStrictEqual(order, [0, 1, 2, 3, 4]);
        done();
      })
      .run(function() {
        async.forever(iterator);
      });
  });

});
