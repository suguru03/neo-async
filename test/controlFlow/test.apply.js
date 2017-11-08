/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#apply', function() {

  it('should apply arguments', function() {

    var func = function() {
      assert.deepStrictEqual(Array.prototype.slice.call(arguments), [1, 2, 3, 4]);
    };

    async.apply(func, 1, 2, 3, 4)();
    async.apply(func, 1, 2, 3)(4);
    async.apply(func, 1, 2)(3, 4);
    async.apply(func, 1)(2, 3, 4);

    var fn = async.apply(func);
    fn(1, 2, 3, 4);
    fn(1, 2, 3, 4);

    assert.strictEqual(
      async.apply(function(name) {
        return 'hello ' + name;
      }, 'world')(),
      'hello world'
    );
  });

  it('should apply long arguments', function() {

    var func = function(a1, a2, a3, a4, a5, a6, a7, a8) {
      assert.strictEqual(a8, 8);
      assert.strictEqual(_.sum(arguments), 55);
    };
    var newFunc = async.apply(func, 1, 2, 3, 4, 5, 6, 7);
    assert.strictEqual(func.length, 8);
    assert.strictEqual(newFunc.length, 1);
    newFunc(8, 9, 10);
  });

  it('should execute waterfall with apply', function(done) {

    async.waterfall([
      function(next) {
        next(null, 1);
      },
      async.apply(function(arg1, arg2, next) {
        assert.strictEqual(arg1, 0);
        assert.strictEqual(arg2, 1);
        next();
      }, 0),
      async.apply(function(arg1, arg2, arg3, arg4, next) {
        assert.strictEqual(arg1, 'a');
        assert.strictEqual(arg2, 'b');
        assert.strictEqual(arg3, 'c');
        assert.strictEqual(arg4, 'd');
        next(null, 1, 2, 3);
      }, 'a', 'b', 'c', 'd')
    ], function(err, res1, res2, res3) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res1, 1);
      assert.strictEqual(res2, 2);
      assert.strictEqual(res3, 3);
      done();
    });
  });

  it('should execute angelFall with apply', function(done) {

    async.angelFall([
      function(next) {
        next(null, 1);
      },
      async.apply(function(arg1, arg2, arg3, next) {
        assert.strictEqual(arg1, 0);
        assert.strictEqual(arg2, 1);
        assert.strictEqual(arg3, undefined);
        next();
      }, 0),
      async.apply(function(arg1, arg2) {
        return arg1 + arg2;
      }, 1, 2),
      async.apply(function(arg1, arg2, arg3, arg4, arg5, arg6, next) {
        assert.strictEqual(arg1, 'a');
        assert.strictEqual(arg2, 'b');
        assert.strictEqual(arg3, 'c');
        assert.strictEqual(arg4, 'd');
        assert.strictEqual(arg5, 3);
        next(null, 1, 2, 3);
      }, 'a', 'b', 'c', 'd')
    ], function(err, res1, res2, res3) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res1, 1);
      assert.strictEqual(res2, 2);
      assert.strictEqual(res3, 3);
      done();
    });
  });

});
