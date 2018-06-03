/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#memoize', function() {

  it('should callback memo if same arguments', function(done) {

    var order = [];
    var fn = function(arg, callback) {
      order.push(arg);
      callback();
    };

    var fn2 = async.memoize(fn);

    fn2(1, function() {

      fn2(2, function() {

        fn2(1, function() {

          assert.deepStrictEqual(order, [1, 2]);
          done();
        });
      });
    });
  });

  it('should callback memo and maintain asynchrony', function(done) {

    var order = [];
    var fn = function(arg1, arg2, callback) {
      order.push(['fn', arg1, arg2]);
      async.setImmediate(function() {
        order.push(['cb', arg1, arg2]);
        callback(null, arg1 + arg2);
      });
    };

    var fn2 = async.memoize(fn);

    fn2(1, 2, function(err, res) {
      assert.equal(res, 3);
      fn2(1, 2, function(err, res) {
        assert.equal(res, 3);
        async.nextTick(memoize_done);
        order.push('tick3');
      });
      order.push('tick2');
    });
    order.push('tick1');

    function memoize_done() {

      var call_order = [
        ['fn', 1, 2],
        'tick1', ['cb', 1, 2],
        // ['fn', 1, 2], memoized
        'tick2',
        // ['cb', 1, 2], memoized
        'tick3'
      ];
      assert.deepStrictEqual(call_order, order);
      done();
    }

  });

  it('should use queue', function(done) {

    var order = [];
    var fn = function(arg, callback) {
      order.push(arg);
      setTimeout(function() {
        callback(null, arg);
      }, 100);
    };

    var fn2 = async.memoize(fn);
    fn2(1, function(err, res) {
      assert.ok(!err);
      assert.strictEqual(res, 1);
    });
    fn2(2, function(err, res) {
      assert.ok(!err);
      assert.strictEqual(res, 2);
    });
    fn2(1, function(err, res) {
      assert.ok(!err);
      assert.strictEqual(res, 1);
    });
    setTimeout(function() {
      assert.deepStrictEqual(order, [1, 2]);
      done();
    }, 300);

  });

  it('should not memoize result if error occurs', function(done) {

    var called = 0;
    var order = [];
    var error = new Error('error');
    var fn = function(arg, callback) {
      called++;
      callback(error, arg);
    };
    var memoized = async.memoize(fn);
    memoized(1, function(err) {
      assert.strictEqual(err, error);
      error = null;
      memoized(1, function(err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(result, 1);
        assert.strictEqual(called, 2);
        done();
      });
    })
  });

});
