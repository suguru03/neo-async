/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

parallel('#queue', function() {

  it('should execute queue', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function piyo(data, callback) {
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

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, concurrency);

    queue.drain = function() {
      assert.deepStrictEqual(order.callback, [2, 1, 4, 3]);
      assert.deepStrictEqual(order.process, [2, 1, 4, 3]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, concurrency);
      done();
    };
  });

  it('should execute even if task name is zero', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var worker = function(data, callback) {
      order.process.push(data);
      callback('err', 'arg');
    };
    var queue = async.queue(worker);
    queue.push(0, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(0);
    });
    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(1);
    });
    queue.drain = function() {
      assert.deepStrictEqual(order.callback, [0, 1]);
      assert.deepStrictEqual(order.process, [0, 1]);
      assert.strictEqual(queue.length(), 0);
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

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 1);

    queue.drain = function() {
      assert.deepStrictEqual(order.callback, [1, 2, 3, 4]);
      assert.deepStrictEqual(order.process, [1, 2, 3, 4]);
      assert.strictEqual(queue.length(), 0);
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

      assert.deepStrictEqual(results, ['hoge', 'fugaError', 'piyo']);
      done();
    };

    var names = ['hoge', 'fuga', 'piyo'];

    _.forEach(names, function(name) {

      queue.push({
        name: name
      }, function(err) {
        if (err) {
          results.push(name + 'Error');
        } else {
          results.push(name);
        }
      });
    });
  });

  it('should throw error if concurrency is zero', function(done) {

    domain.create()
      .on('error', function(err) {
        assert.strictEqual(err.message, 'Concurrency must not be zero');
        done();
      })
      .run(function() {
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
        setImmediate(function() {
          async.queue(worker, 0);
        });
      });
  });

  it('should call global error handler', function(done) {

    var results = [];
    var q = async.queue(function (task, callback) {
      callback(task.name === 'foo' ? new Error('fooError') : null);
    }, 2);

    q.error = function(err, task) {
      assert.ok(err);
      assert.strictEqual(err.message, 'fooError');
      assert.strictEqual(task.name, 'foo');
      results.push('fooError');
    };

    q.drain = function() {
      assert.deepStrictEqual(results, ['fooError', 'bar']);
      done();
    };

    q.push({ name: 'foo' });
    q.push({ name: 'bar' }, function(err) {
      if (err) {
        return done(err);
      }
      results.push('bar');
    });
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
    var queue = async.queue(iterator);
    queue.push(1, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
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

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 2);

    queue.drain = function() {
      assert.deepStrictEqual(order.callback, [2, 1, 3, 4]);
      assert.deepStrictEqual(order.process, [2, 1, 3, 4]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, 1);
      done();
    };
  });

  it('should execute using unshift', function(done) {

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
    queue.saturated = function() {
      setTimeout(function() {
        assert.strictEqual(queue.running(), 2);
      }, 40);
    };

    queue.unshift(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      queue.concurrency = 1;
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(2);
    });
    queue.unshift(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(3);
    });
    queue.unshift(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 2);

    queue.drain = function() {
      assert.deepStrictEqual(order.callback, [3, 4, 2, 1]);
      assert.deepStrictEqual(order.process, [3, 4, 2, 1]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, 1);
      done();
    };
  });

  it('should execute drain immediately if insert task is empty', function(done) {

    var order = [];
    var worker = function(data, callback) {
      order.push(1);
      callback();
    };
    var queue = async.queue(worker);
    queue.drain = function() {
      assert.deepStrictEqual(order, []);
      done();
    };
    queue.push();
  });

  it('should execute empty function if task is empty', function(done) {

    var worker = function(data, callback) {
      setTimeout(function() {
        callback();
      }, 50);
    };

    var called = false;
    var queue = async.queue(worker);
    queue.empty = function() {
      assert.strictEqual(queue.length(), 0);
      called = true;
    };
    queue.push(1, function() {
      assert.strictEqual(queue.length(), 0);
    });
    queue.drain = function() {
      assert.ok(called);
      done();
    };
  });

  it('should pause, resume and kill', function(done) {

    var order = [];
    var delays = [40, 20];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.push(data);
        callback();
      }, delays.shift());
    };

    var queue = async.queue(worker);
    queue.resume();
    queue.pause();
    queue.push(1, function() {
      assert.strictEqual(queue.length(), 0);
    });
    queue.push(2, function() {});
    setTimeout(function() {
      queue.resume();
    }, 100);
    setTimeout(function() {
      queue.kill();
    }, 120);
    setTimeout(function() {
      assert.deepStrictEqual(order, [1]);
      done();
    }, 200);
  });

  it('should kill process', function(done) {

    var q = async.queue(function(task, callback) {
      setTimeout(function() {
        assert.equal(false, 'Function should never be called');
        callback();
      }, 100);
    }, 1);
    q.drain = function() {
      assert.equal(false, 'Function should never be called');
    };

    q.push(0);
    q.kill();

    setTimeout(function() {
      assert.strictEqual(q.length(), 0);
      done();
    }, 200);
  });

  it('should check events', function(done) {

    var calls = [];
    var q = async.queue(function(task, cb) {
      // nop
      calls.push('process ' + task);
      setImmediate(cb);
    }, 10);
    q.concurrency = 3;

    q.saturated = function() {
      assert.strictEqual(q.running(), q.concurrency);
      calls.push('saturated');
    };
    q.empty = function() {
      assert.strictEqual(q.length(), 0);
      calls.push('empty');
    };
    q.drain = function() {
      assert.strictEqual(q.length(), 0);
      assert.strictEqual(q.running(), 0);
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
    q.push('foo', function() {
      calls.push('foo cb');
    });
    q.push('bar', function() {
      calls.push('bar cb');
    });
    q.push('zoo', function() {
      calls.push('zoo cb');
    });
    q.push('poo', function() {
      calls.push('poo cb');
    });
    q.push('moo', function() {
      calls.push('moo cb');
    });
  });

  it('should start', function(done) {

    var q = async.queue(function() {});

    assert.strictEqual(q.started, false);
    q.push([]);
    assert.strictEqual(q.started, true);
    done();
  });

  it('should check concurrency when queue paused and resumed', function(done) {

    var order = [];
    var q = async.queue(function(task, callback) {
      var name = task.name;
      order.push(['process', name]);
      setTimeout(function() {
        order.push(['called', name]);
        callback();
      }, 100);
    }, 5);

    q.pause();
    _.times(10, function(n) {
      q.push({
        name: ++n
      });
    });
    setTimeout(q.resume, 100);

    q.drain = function() {
      assert.deepStrictEqual(order, [
        ['process', 1],
        ['process', 2],
        ['process', 3],
        ['process', 4],
        ['process', 5],
        ['called', 1],
        ['process', 6],
        ['called', 2],
        ['process', 7],
        ['called', 3],
        ['process', 8],
        ['called', 4],
        ['process', 9],
        ['called', 5],
        ['process', 10],
        ['called', 6],
        ['called', 7],
        ['called', 8],
        ['called', 9],
        ['called', 10]
      ]);
      done();
    };
  });

  it('should get workers list', function(done) {
    var order = [];
    var q = async.queue(function(task, callback) {
      var name = task.name;
      order.push(['process', name]);
      setTimeout(function() {
        order.push(['called', name]);
        callback();
      }, 100);
    }, 5);

    q.pause();
    _.times(10, function(n) {
      q.push({
        name: ++n
      });
    });
    setTimeout(q.resume, 100);
    setTimeout(function() {
      var list = q.workersList();
      assert.strictEqual(list.length, 5);
      assert.strictEqual(list[0].data.name, 6);
      assert.strictEqual(list[1].data.name, 7);
      assert.strictEqual(list[2].data.name, 8);
      assert.strictEqual(list[3].data.name, 9);
      assert.strictEqual(list[4].data.name, 10);
    }, 250);

    q.drain = function() {
      assert.deepStrictEqual(order, [
        ['process', 1],
        ['process', 2],
        ['process', 3],
        ['process', 4],
        ['process', 5],
        ['called', 1],
        ['process', 6],
        ['called', 2],
        ['process', 7],
        ['called', 3],
        ['process', 8],
        ['called', 4],
        ['process', 9],
        ['called', 5],
        ['process', 10],
        ['called', 6],
        ['called', 7],
        ['called', 8],
        ['called', 9],
        ['called', 10]
      ]);
      done();
    };
  });

  it('should have a default buffer property that equals 25% of the concurrenct rate', function(done) {

    var concurrency = 10;
    var worker = function(task, callback) {
      assert.ok(false);
      async.setImmediate(callback);
    };
    var queue = async.queue(worker, concurrency);
    assert.strictEqual(queue.buffer, 2.5);
    setTimeout(done, 50);
  });

  it('should allow a user to change the buffer property', function(done) {

    var concurrency = 10;
    var worker = function(task, callback) {
      assert.ok(false);
      async.setImmediate(callback);
    };
    var queue = async.queue(worker, concurrency);
    queue.buffer = 4;
    assert.notStrictEqual(queue.buffer, 2.5);
    assert.strictEqual(queue.buffer, 4);
    setTimeout(done, 50);
  });

  it('should execute even if concurrency is infinity', function(done) {

    var called = 0;
    var queue = async.queue(function(data, callback) {
      called++;
      callback(null, data);
    }, Infinity);
    queue.pause();
    _.times(10, function(n) {
      queue.push(n, function(err, res) {
        assert.strictEqual(res, n);
      });
    });
    queue.resume();
    setTimeout(function() {
      assert.strictEqual(called, 10);
      done();
    }, 50);
  });

  it('should throw an error if callback is not function', function() {

    var worker = function(task, callback) {
      assert.ok(false);
      async.setImmediate(callback);
    };
    var queue = async.queue(worker);
    try {
      queue.push(1, 2);
    } catch(e) {
      assert.ok(e);
      assert.strictEqual(e.message, 'task callback must be a function');
    }
  });

  it('should throw an error if callback is called twice', function(done) {

    var worker = function(task, callback) {
      callback(null, task);
      callback(null, task);
    };
    var called = 0;
    var queue = async.queue(worker);
    domain.create()
      .on('error', util.errorChecker)
      .run(function() {
        queue.push(1, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(res, 1);
          assert.strictEqual(++called, 1);
        });
      });

    setTimeout(function() {
      assert.strictEqual(called, 1);
      done();
    }, delay);
  });

  it('should pass more than 2 arguments', function(done) {

    var worker = function(data, callback) {
      switch (data) {
        case 0:
          return callback(null, 1, 2);
        case 1:
          return callback(null, 2, 3, 4);
        case 2:
          return callback(null, 3, 4, 5, 6);
      }
    };

    var queue = async.queue(worker);
    queue.push(0, function(err, res1, res2, res3, res4) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res1, 1);
      assert.strictEqual(res2, 2);
      assert.strictEqual(res3, undefined);
      assert.strictEqual(res4, undefined);
    });
    queue.push(1, function(err, res1, res2, res3, res4) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res1, 2);
      assert.strictEqual(res2, 3);
      assert.strictEqual(res3, 4);
      assert.strictEqual(res4, undefined);
    });
    queue.push(2, function(err, res1, res2, res3, res4) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res1, 3);
      assert.strictEqual(res2, 4);
      assert.strictEqual(res3, 5);
      assert.strictEqual(res4, 6);
    });
    setTimeout(done, delay);
  });

  it('should pause in worker with concurrency', function(done) {

    var order = [];
    var q = async.queue(function(task, callback) {
      if (task.isLongRunning) {
        q.pause();
        setTimeout(function() {
          order.push(task.id);
          q.resume();
          callback();
        }, 500);
      } else {
        order.push(task.id);
        callback();
      }
    }, 10);

    q.push({ id: 1, isLongRunning: true });
    q.push({ id: 2 });
    q.push({ id: 3 });
    q.push({ id: 4 });
    q.push({ id: 5 });

    setTimeout(function() {
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5]);
      done();
    }, 1000);
  });

  it('should remove', function(done) {

    var result = [];
    var q = async.queue(function(data, callback) {
      result.push(data);
      async.setImmediate(callback);
    });

    q.push([1, 2, 3, 4, 5]);

    q.remove(function (node) {
      return node.data === 3;
    });

    q.drain = function() {
      assert.deepStrictEqual(result, [1, 2, 4, 5]);
      done();
    };
  });

});

parallel('#priorityQueue', function() {

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
      assert.deepStrictEqual(order.process, [2, 1, 4, 3]);
      assert.deepStrictEqual(order.callback, [2, 1, 4, 3]);
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
    var called = false;
    var concurrency = 2;
    var queue = async.priorityQueue(worker, concurrency);
    queue.saturated = function() {
      called = true;
    };

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
      assert.deepStrictEqual(order.process, [1, 2, 3, 4]);
      assert.deepStrictEqual(order.callback, [1, 2, 3, 4]);
      assert.strictEqual(queue.concurrency, 2);
      assert.strictEqual(queue.length(), 0);
      assert.ok(called);
      done();
    };
  });

  it('should execute drain immediately if insert task is empty', function(done) {

    var order = [];
    var worker = function(data, callback) {
      order.push(1);
      callback();
    };
    var queue = async.priorityQueue(worker);
    queue.drain = function() {
      assert.deepStrictEqual(order, []);
      done();
    };
    queue.push();
  });

  it('should pause in worker with concurrency', function(done) {

    var order = [];
    var q = async.priorityQueue(function(task, callback) {
      if (task.isLongRunning) {
        q.pause();
        setTimeout(function() {
          order.push(task.id);
          q.resume();
          callback();
        }, 500);
      } else {
        order.push(task.id);
        callback();
      }
    }, 10);

    q.push({ id: 1, isLongRunning: true });
    q.push({ id: 2 });
    q.push({ id: 3 });
    q.push({ id: 4 });
    q.push({ id: 5 });

    setTimeout(function() {
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5]);
      done();
    }, 1000);
  });

  it('should have a default buffer property that equals 25% of the concurrenct rate', function(done) {

    var concurrency = 10;
    var worker = function(task, callback) {
      assert.ok(false);
      async.setImmediate(callback);
    };
    var queue = async.priorityQueue(worker, concurrency);
    assert.strictEqual(queue.buffer, 2.5);
    setTimeout(done, 50);
  });

  it('should allow a user to change the buffer property', function(done) {

    var concurrency = 10;
    var worker = function(task, callback) {
      assert.ok(false);
      async.setImmediate(callback);
    };
    var queue = async.priorityQueue(worker, concurrency);
    queue.buffer = 4;
    assert.notStrictEqual(queue.buffer, 2.5);
    assert.strictEqual(queue.buffer, 4);
    setTimeout(done, 50);
  });

  it('should call the unsaturated callback if tasks length is less than concurrency minus buffer', function(done) {
    var order = [];
    var concurrency = 10;
    var worker = function(task, callback) {
      order.push('worker_' + task);
      async.setImmediate(callback);
    };
    var queue = async.priorityQueue(worker, concurrency);
    queue.unsaturated = function() {
      order.push('unsaturated');
    };
    queue.empty = function() {
      order.push('empty');
    };
    queue.push('test1', 5, function() { order.push('test1'); });
    queue.push('test2', 4, function() { order.push('test2'); });
    queue.push('test3', 3, function() { order.push('test3'); });
    queue.push('test4', 2, function() { order.push('test4'); });
    queue.push('test5', 1, function() { order.push('test5'); });
    setTimeout(function() {
      assert.deepStrictEqual(order, [
        'worker_test5',
        'worker_test4',
        'worker_test3',
        'worker_test2',
        'empty',
        'worker_test1',
        'test5',
        'unsaturated',
        'test4',
        'unsaturated',
        'test3',
        'unsaturated',
        'test2',
        'unsaturated',
        'test1',
        'unsaturated'
      ]);
      done();
    }, 50);
  });

  it('should not be idle when empty is called', function(done) {
    var calls = [];
    var worker = function(task, cb) {
      calls.push('process ' + task);
      async.setImmediate(cb);
    };
    var q = async.queue(worker, 1);

    q.empty = function () {
      calls.push('empty');
      assert(q.idle() === false, 'tasks should be running when empty is called')
      assert.strictEqual(q.running(), 1);
    };

    q.drain = function() {
      assert.deepStrictEqual(calls, [
        'empty',
        'process 1',
      ]);
      done();
    };
    q.push(1);
  });

});
