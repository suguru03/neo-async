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
      assert.equal(err, 'err');
      assert.equal(arg, 'arg');
      assert.equal(cargo.length(), 3);
      order.push('callback ' + 1);
    });
    cargo.push(2, function(err, arg) {
      assert.equal(err, 'err');
      assert.equal(arg, 'arg');
      assert.equal(cargo.length(), 3);
      order.push('callback ' + 2);
    });

    assert.equal(cargo.length(), 2);

    setTimeout(function() {
      cargo.push(3, function(err, arg) {
        assert.equal(err, 'err');
        assert.equal(arg, 'arg');
        assert.equal(cargo.length(), 1);
        order.push('callback ' + 3);
      });
    }, 60);

    setTimeout(function() {
      cargo.push(4, function(err, arg) {
        assert.equal(err, 'err');
        assert.equal(arg, 'arg');
        //assert.equal(cargo.length(), 1);
        order.push('callback ' + 4);
      });
      assert.equal(cargo.length(), 2);
      cargo.push(5, function(err, arg) {
        assert.equal(err, 'err');
        assert.equal(arg, 'arg');
        order.push('callback ' + 5);
        assert.equal(cargo.length(), 0);
      });
    }, 120);

    setTimeout(function() {
      assert.deepEqual(order, [
        'process 1 2', 'callback 1', 'callback 2',
        'process 3 4', 'callback 3', 'callback 4',
        'process 5', 'callback 5'
      ]);
      assert.equal(cargo.length(), 0);
      done();
    }, 800);

  });

});

