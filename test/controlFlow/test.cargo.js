/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

parallel('#cargo', function() {

  it('should execute in accordance with payload', function(done) {

    var order = [];
    var delays = [4 * delay, 4 * delay, 2 * delay];
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
    }, 2 * delay);

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
    }, 3 * delay);

    setTimeout(function() {
      assert.deepStrictEqual(order, [
        'process 1 2', 'callback 1', 'callback 2',
        'process 3 4', 'callback 3', 'callback 4',
        'process 5', 'callback 5'
      ]);
      assert.strictEqual(cargo.length(), 0);
      done();
    }, 20 * delay);
  });

  it('should execute without callback', function(done) {

    var order = [];
    var delays = [
      4 * delay,
      2 * delay,
      6 * delay,
      2 * delay
    ];

    var c = async.cargo(function(tasks, callback) {
      setTimeout(function() {
        order.push('process ' + tasks.join(' '));
        callback('error', 'arg');
      }, delays.shift());
    }, 2);

    c.push(1);
    setTimeout(function() {
      c.push(2);
    }, 3 * delay);
    setTimeout(function() {
      c.push(3);
      c.push(4);
      c.push(5);
    }, 4.5 * delay);

    setTimeout(function() {
      assert.deepStrictEqual(order, [
        'process 1',
        'process 2',
        'process 3 4',
        'process 5'
      ]);
      done();
    }, 20 * delay);

  });

  it('should execute with bulk tasks', function(done) {

    var order = [];
    var delays = [3 * delay, delay];

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
      assert.deepStrictEqual(order, [
        'process 1 2 3',
        'callback 1 2 3',
        'callback 1 2 3',
        'callback 1 2 3',
        'process 4',
        'callback 4'
      ]);
      done();
    }, 20 * delay);
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
      assert.deepStrictEqual(order, [
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
    setTimeout(loadCargo, 5 * delay);

    setTimeout(function() {
      assert.deepStrictEqual(order, [
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
      assert.ok(empty);
      done();
    }, 10 * delay);

  });

  it('should get workers list', function(done) {

    var order = [];
    var workersList = [];
    var tasks = [0, 1, 2, 3, 4];
    var payload = 3;
    var worker = function(tasks, callback) {
      order.push(tasks);
      workersList.push(_.cloneDeep(c.workersList()));
      callback();
    };
    var c = async.cargo(worker, payload);
    c.push(tasks);
    c.drain = function() {
      assert.deepStrictEqual(order, [
        [0, 1, 2],
        [3, 4]
      ]);
      assert.strictEqual(workersList.length, 2);
      assert.strictEqual(workersList[0].length, 3);
      assert.strictEqual(workersList[1].length, 2);
      done();
    };
  });

  it('should check events', function (done) {

    var calls = [];
    var q = async.cargo(function(task, cb) {
      // nop
      calls.push('process ' + task);
      async.setImmediate(cb);
    }, 1);
    q.concurrency = 3;

    q.saturated = function() {
      assert(q.running() === 3, 'cargo should be saturated now');
      calls.push('saturated');
    };
    q.empty = function() {
      assert(q.length() === 0, 'cargo should be empty now');
      calls.push('empty');
    };
    q.drain = function() {
      assert(
        q.length() === 0 && q.running() === 0,
        'cargo should be empty now and no more workers should be running'
      );
      calls.push('drain');
      assert.deepStrictEqual(calls, [
        'process foo',
        'process bar',
        'saturated',
        'process zoo',
        'foo cb',
        'saturated',
        'process poo',
        'bar cb',
        'empty',
        'saturated',
        'process moo',
        'zoo cb',
        'poo cb',
        'moo cb',
        'drain'
      ]);
      done();
    };
    q.push('foo', function () {calls.push('foo cb');});
    q.push('bar', function () {calls.push('bar cb');});
    q.push('zoo', function () {calls.push('zoo cb');});
    q.push('poo', function () {calls.push('poo cb');});
    q.push('moo', function () {calls.push('moo cb');});
  });

  it('should avoid double callback', function(done) {

    var called = false;
    var iterator = function(task, callback) {
      try {
        callback('error');
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
    var cargo = async.cargo(iterator);
    cargo.push(1, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

});
