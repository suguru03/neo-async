/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');

describe('#queue', function() {

  it('should execute queue', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.process.push(data);
        callback('err', 'arg');
      }, delays.shift());
    };
    var concurrency = 2;
    var queue = async.queue(worker, concurrency);

    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(2);
    });
    queue.push(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(3);
    });
    queue.push(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(),  4);
    assert.strictEqual(queue.concurrency, concurrency);

    queue.drain = function() {
      assert.deepEqual(order.callback, [2, 1, 4, 3]);
      assert.deepEqual(order.process, [2, 1, 4, 3]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, concurrency);
      done();
    };
  });

  it('should execute queue with default concurrency', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.process.push(data);
        callback('err', 'arg');
      }, delays.shift());
    };

    var queue = async.queue(worker);

    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 3);
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(2);
    });
    queue.push(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(3);
    });
    queue.push(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(),  4);
    assert.strictEqual(queue.concurrency, 1);

    queue.drain = function() {
      assert.deepEqual(order.callback, [1, 2, 3, 4]);
      assert.deepEqual(order.process, [1, 2, 3, 4]);
      assert.strictEqual(queue.length(),  0);
      assert.strictEqual(queue.concurrency, 1);
      done();
    };
  });

  it('should execute queue and throw error', function(done) {

    var results = [];
    var iterator = function(task, callback) {
      if (task.name === 'fuga') {
        return callback(new Error('error'));
      }
      callback();
    };
    var queue = async.queue(iterator);

    queue.drain = function() {

      assert.deepEqual(results, ['hoge', 'fugaError', 'piyo']);
      done();
    };

    var names = ['hoge', 'fuga', 'piyo'];

    _.forEach(names, function(name) {

      queue.push({ name: name }, function(err) {
        if (err) {
          results.push(name + 'Error');
        } else {
          results.push(name);
        }
      });
    });

  });

  it('should execute while changing concurrency', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.process.push(data);
        callback('err', 'arg');
      }, delays.shift());
    };

    var queue = async.queue(worker, 2);

    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      queue.concurrency = 1;
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(2);
    });
    queue.push(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(3);
    });
    queue.push(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(),  4);
    assert.strictEqual(queue.concurrency, 2);

    queue.drain = function() {
      assert.deepEqual(order.callback, [2, 1, 3, 4]);
      assert.deepEqual(order.process, [2, 1, 3, 4]);
      assert.strictEqual(queue.length(),  0);
      assert.strictEqual(queue.concurrency, 1);
      done();
    };

  });

});

describe('#priorityQueue', function() {

  it('should execute queue by priority sequence', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var worker = function(task, callback) {
      order.process.push(task);
      callback('err', 'arg');
    };
    var queue = async.priorityQueue(worker);

    queue.push(1, 1.4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(1);
    });
    queue.push(2, 0.2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 3);
      order.callback.push(2);
    });
    queue.push(3, 3.8, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(3);
    });
    queue.push(4, 2.9, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 1);

    queue.drain = function() {
      assert.deepEqual(order.process, [2, 1, 4, 3]);
      assert.deepEqual(order.callback, [2, 1, 4, 3]);
      assert.strictEqual(queue.concurrency, 1);
      assert.strictEqual(queue.length(), 0);
      done();
    };
  });

  it('should execute queue by priority sequence with concurrency', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(task, callback) {
      setTimeout(function() {
        order.process.push(task);
        callback('err', 'arg');
      }, delays.shift());
    };
    var concurrency = 2;
    var queue = async.priorityQueue(worker, concurrency);

    queue.push(1, 1.4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(1);
    });
    queue.push(2, 0.2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(2);
    });
    queue.push(3, 3.8, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(3);
    });
    queue.push(4, 2.9, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 2);

    queue.drain = function() {
      assert.deepEqual(order.process, [1, 2, 3, 4]);
      assert.deepEqual(order.callback, [1, 2, 3, 4]);
      assert.strictEqual(queue.concurrency, 2);
      assert.strictEqual(queue.length(), 0);
      done();
    };

  });

});

