/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#cargo', function() {

  it('should execute in accordance with payload', function(done) {

    var order = [];
    var delays = [160, 160, 80];
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
    }, 60);

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
    }, 120);

    setTimeout(function() {
      assert.deepEqual(order, [
        'process 1 2', 'callback 1', 'callback 2',
        'process 3 4', 'callback 3', 'callback 4',
        'process 5', 'callback 5'
      ]);
      assert.strictEqual(cargo.length(), 0);
      done();
    }, 800);

  });

  it('should execute without callback', function(done) {

    var order = [];
    var delays = [160, 80, 240, 80];

    var c = async.cargo(function(tasks, callback) {
      setTimeout(function() {
        order.push('process ' + tasks.join(' '));
        callback('error', 'arg');
      }, delays.shift());
    }, 2);

    c.push(1);
    setTimeout(function() {
      c.push(2);
    }, 120);
    setTimeout(function() {
      c.push(3);
      c.push(4);
      c.push(5);
    }, 180);

    setTimeout(function() {
      assert.deepEqual(order, [
        'process 1',
        'process 2',
        'process 3 4',
        'process 5'
      ]);
      done();
    }, 800);

  });

  it('should execute with bulk tasks', function(done) {

    var order = [];
    var delays = [120, 40];

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
    }, 800);
  });

});

