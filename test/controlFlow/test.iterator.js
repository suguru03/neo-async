/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#iterator', function() {

  it('should execute iterators', function(done) {

    var order = [];
    var iterator = async.iterator([
      function() {
        order.push(1);
      },
      function(arg1) {
        assert.strictEqual(arg1, 'arg1');
        order.push(2);
      },
      function(arg1, arg2) {
        assert.strictEqual(arg1, 'arg1');
        assert.strictEqual(arg2, 'arg2');
        order.push(3);
      }
    ]);

    iterator();
    assert.deepStrictEqual(order, [1]);
    var iterator2 = iterator();
    assert.deepStrictEqual(order, [1, 1]);
    var iterator3 = iterator2('arg1');
    assert.deepStrictEqual(order, [1, 1, 2]);
    var iterator4 = iterator3('arg1', 'arg2');
    assert.deepStrictEqual(order, [1, 1, 2, 3]);
    assert.strictEqual(iterator4, null);
    done();
  });

  it('should execute object iterators', function(done) {

    var order = [];
    var iterator = async.iterator({
      a: function() {
        order.push(1);
      },
      b: function(arg1) {
        assert.strictEqual(arg1, 'arg1');
        order.push(2);
      },
      c: function(arg1, arg2) {
        assert.strictEqual(arg1, 'arg1');
        assert.strictEqual(arg2, 'arg2');
        order.push(3);
      }
    });

    iterator();
    assert.deepStrictEqual(order, [1]);
    var iterator2 = iterator();
    assert.deepStrictEqual(order, [1, 1]);
    var iterator3 = iterator2('arg1');
    assert.deepStrictEqual(order, [1, 1, 2]);
    var iterator4 = iterator3('arg1', 'arg2');
    assert.deepStrictEqual(order, [1, 1, 2, 3]);
    assert.strictEqual(iterator4, null);
    done();

  });

  it('should get undefined if array is empty', function(done) {

    var iterator = async.iterator([]);
    assert.deepStrictEqual(iterator(), null);
    assert.deepStrictEqual(iterator.next(), null);
    done();
  });

  it('should get next iterator', function(done) {

    var order = [];
    var iterator = async.iterator([
      function() {
        order.push(1);
      },
      function(arg1) {
        assert.strictEqual(arg1, 'arg1');
        order.push(2);
      },
      function(arg1, arg2) {
        assert.strictEqual(arg1, 'arg1');
        assert.strictEqual(arg2, 'arg2');
        order.push(3);
      }
    ]);

    var fn = iterator.next();
    var iterator2 = fn('arg1');
    assert.deepStrictEqual(order, [2]);
    iterator2('arg1', 'arg2');
    assert.deepStrictEqual(order, [2, 3]);
    assert.deepStrictEqual(iterator2.next(), null);
    done();
  });

});
