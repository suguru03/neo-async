/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = global.async || require('../../');
var domain = require('domain').create();

describe('#forever', function() {

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
      assert.deepEqual(order, [0, 1, 2, 3, 4]);
      done();
    });
  });

  it('should execute with binding until error occurs', function(done) {

    var count = 0;
    var limit = 5;
    var order = [];
    var result = [];
    var iterator = function(callback) {
      result.push(this.pow(count, 2));
      order.push(count++);
      if (count === limit) {
        return callback(new Error('end'));
      }
      callback();
    };

    async.forever(iterator, function(err) {
      assert.ok(err);
      assert.deepEqual(order, [0, 1, 2, 3, 4]);
      assert.deepEqual(result, [0, 1, 4, 9, 16]);
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
    domain.on('error', function(err) {
      assert.strictEqual(err.message, 'end');
      assert.deepEqual(order, [0, 1, 2, 3, 4]);
      done();
    });
    domain.run(function() {
      async.forever(iterator);
    });
  });

});
