/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = global.async || require('../../');

describe('#cargo', function() {

  it('should execute in accordance with payload', function(done) {

    var order = [];
    var delays = [40, 40, 20];
    var iterator = function(tasks, callback) {
      setTimeout(function() {
        order.push('process ' + tasks.join(' '));
        callback('err', 'arg');
      }, delays.shift());
    };

    var cargo = async.cargo(iterator, 2);

    cargo.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(cargo.length(), 3);
      order.push('callback ' + 1);
    });
    cargo.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(cargo.length(), 3);
      order.push('callback ' + 2);
    });

    assert.strictEqual(cargo.length(), 2);

    setTimeout(function() {
      cargo.push(3, function(err, arg) {
        assert.strictEqual(err, 'err');
        assert.strictEqual(arg, 'arg');
        assert.strictEqual(cargo.length(), 1);
        order.push('callback ' + 3);
      });
    }, 20);

    setTimeout(function() {
      cargo.push(4, function(err, arg) {
        assert.strictEqual(err, 'err');
        assert.strictEqual(arg, 'arg');
        assert.strictEqual(cargo.length(), 1);
        order.push('callback ' + 4);
      });
      assert.strictEqual(cargo.length(), 2);
      cargo.push(5, function(err, arg) {
        assert.strictEqual(err, 'err');
        assert.strictEqual(arg, 'arg');
        order.push('callback ' + 5);
        assert.strictEqual(cargo.length(), 0);
      });
    }, 30);

    setTimeout(function() {
      assert.deepEqual(order, [
        'process 1 2', 'callback 1', 'callback 2',
        'process 3 4', 'callback 3', 'callback 4',
        'process 5', 'callback 5'
      ]);
      assert.strictEqual(cargo.length(), 0);
      done();
    }, 200);

  });

  it('should execute without callback', function(done) {

    var order = [];
    var delays = [40, 20, 60, 20];

    var c = async.cargo(function(tasks, callback) {
      setTimeout(function() {
        order.push('process ' + tasks.join(' '));
        callback('error', 'arg');
      }, delays.shift());
    }, 2);

    c.push(1);
    setTimeout(function() {
      c.push(2);
    }, 30);
    setTimeout(function() {
      c.push(3);
      c.push(4);
      c.push(5);
    }, 45);

    setTimeout(function() {
      assert.deepEqual(order, [
        'process 1',
        'process 2',
        'process 3 4',
        'process 5'
      ]);
      done();
    }, 200);

  });

  it('should execute with bulk tasks', function(done) {

    var order = [];
    var delays = [30, 10];

    var c = async.cargo(function(tasks, callback) {
      setTimeout(function() {
        order.push('process ' + tasks.join(' '));
        callback('error', tasks.join(' '));
      }, delays.shift());
    }, 3);

    c.push([1, 2, 3, 4], function(err, arg) {
      assert.strictEqual(err, 'error');
      order.push('callback ' + arg);
    });

    assert.strictEqual(c.length(), 4);

    setTimeout(function() {
      assert.deepEqual(order, [
        'process 1 2 3',
        'callback 1 2 3',
        'callback 1 2 3',
        'callback 1 2 3',
        'process 4',
        'callback 4'
      ]);
      done();
    }, 200);
  });

  it('should execute drain once', function(done) {

    var order = [];
    var c = async.cargo(function(tasks, callback) {
      order.push(tasks);
      callback();
    }, 3);

    var drainCounter = 0;
    c.drain = function() {
      drainCounter++;
    };

    var n = 10;
    _.times(n, c.push);
    assert.strictEqual(c.length(), 10);

    setTimeout(function() {
      assert.deepEqual(order, [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9]
      ]);
      assert.strictEqual(drainCounter, 1);
      done();
    }, 120);

  });

  it('should execute drain twice', function(done) {

    var order = [];
    var c = async.cargo(function(tasks, callback) {
      order.push(tasks);
      assert.ok(c.running());
      callback();
    }, 3);

    var drainCounter = 0;
    c.drain = function() {
      drainCounter++;
    };
    var saturated = false;
    c.saturated = function() {
      saturated = true;
    };

    var n = 10;
    var loadCargo = _.times.bind(_, n, c.push);
    loadCargo();
    assert.strictEqual(c.length(), 10);

    var empty = false;
    c.empty = function() {
      empty = true;
    };
    setTimeout(loadCargo, 50);

    setTimeout(function() {
      assert.deepEqual(order, [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9],
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9]
      ]);
      assert.strictEqual(drainCounter, 2);
      assert.ok(saturated);
      done();
    }, 100);

  });

});
