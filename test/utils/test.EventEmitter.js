/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var delay = require('../config').delay;

function createTasks(order, numbers) {
  return _.map(numbers, function(num) {
    return function(callback) {
      setTimeout(function() {
        order.push(num);
        callback(null, num);
      }, num * 30);
    };
  });
}

describe('#eventEmitter', function() {

  it('should get a listener', function() {
    var eventEmitter = new async.EventEmitter();
    var event1 = function(callback) {
      callback();
    };
    eventEmitter.on('event1', event1);
    assert.deepEqual(eventEmitter.getListeners('event1'), [event1]);
  });

  it('should get all listeners', function() {
    var eventEmitter = new async.EventEmitter();
    var event1 = function(callback) {
      callback();
    };
    var event2 = function() {};
    eventEmitter.on({
      'event1': event1,
      'event2': [event2, event2]
    });
    eventEmitter.once('event2', event2);
    assert.deepEqual(eventEmitter.getListeners(), {
      'event1': [event1],
      'event2': [event2, event2, event2]
    });
  });

  it('should execute emitter', function(done) {
    var order = [];
    var eventEmitter = new async.EventEmitter();
    eventEmitter.on('event1', function event1_1(done) {
      order.push('event1_1');
      done(null, 'event1_1');
    });
    eventEmitter.on('event2', function event2_1(done) {
      order.push('event2_1');
      done(null, 'event2_1');
    });
    eventEmitter.once({
      event1: [function event1_2(done) {
        order.push('event1_2');
        done(null, 'event1_2');
      }]
    });
    eventEmitter.once({
      event1: function event1_3(done) {
        order.push('event1_3');
        done(null, 'event1_3');
      }
    });
    eventEmitter.on({
      event1: [function event1_4(done) {
        order.push('event1_4');
        done(null, 'event1_4');
      }],
      event2: function event2_2(done) {
        order.push('event2_2');
        done(null, 'event2_2');
      }
    });
    eventEmitter.emit('event1', function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [
        'event1_1',
        'event1_2',
        'event1_3',
        'event1_4'
      ]);
      eventEmitter.emit('event2', function(err, res) {
        if (err) {
          return done(err);
        }
        assert.deepEqual(res, [
          'event2_1',
          'event2_2'
        ]);
        eventEmitter.emit('event1', function(err, res) {
          if (err) {
            return done(err);
          }
          assert.deepEqual(res, [
            'event1_1',
            'event1_4'
          ]);
          done();
        });
      });
    });
  });

  it('should execute events in series', function(done) {
    var order = [];
    var numbers = [1, 2, 4, 3];
    var eventEmitter = async.eventEmitter();
    var tasks = createTasks(order, numbers);
    eventEmitter.on('event', tasks);
    eventEmitter.emit('event', function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 4, 3]);
      assert.deepEqual(order, [1, 2, 4, 3]);
      done();
    });
  });

  it('should execute events in parallel', function(done) {
    var order = [];
    var numbers = [1, 2, 4, 3];
    var eventEmitter = async.eventEmitter({
      parallel: true
    });
    var tasks = createTasks(order, numbers);
    eventEmitter.on('event', tasks);
    eventEmitter.emit('event', function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 4, 3]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute events in limited parallel', function(done) {

    var order = [];
    var numbers = [1, 4, 2, 3];
    var eventEmitter = async.eventEmitter({
      parallel: true,
      limit: 2
    });
    var tasks = createTasks(order, numbers);
    eventEmitter.on('event', tasks);
    eventEmitter.emit('event', function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 4, 2, 3]);
      assert.deepEqual(order, [1, 2, 4, 3]);
      done();
    });
  });

  it('should execute same functions events', function(done) {
    var count = 0;
    var eventEmitter = async.eventEmitter();
    var func = function(done) {
      count++;
      done();
    };
    eventEmitter.once('event', [
      func,
      func,
      func,
      func
    ]);
    eventEmitter.emit('event', function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(count, 4);
      eventEmitter.emit('event', function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(count, 4);
        done();
      });
    });
  });

  it('should execute events by original emitter', function(done) {
    var order = [];
    var numbers = [1, 4, 3, 2];
    var emitter = function(tasks, callback) {
      callback(null, tasks);
    };
    var eventEmitter = async.eventEmitter({
      emitter: emitter
    });
    var tasks = createTasks(order, numbers);
    eventEmitter.on('event', tasks);
    eventEmitter.emit('event', function(err, res) {
      if (err) {
        return done(err);
      }
      _.forEach(tasks, function(task, index) {
        assert.strictEqual(res[index].func, task);
      });
      done();
    });
  });

  it('should return callback immediately if tasks is empty', function(done) {
    var eventEmitter = async.eventEmitter();
    eventEmitter.emit('event', done);
  });

  it('should not remove if callback is not called', function(done) {
    var called = 0;
    var eventEmitter = new async.EventEmitter();

    function event(done) {
      called++;
      done();
    }
    eventEmitter.once('event1', event);
    eventEmitter.on('event1', event);
    eventEmitter.once('event2', event);
    eventEmitter.on('event2', event);
    eventEmitter.on('event2', event);
    eventEmitter.once('event2', event);
    eventEmitter.once('event1', event);
    eventEmitter.emit('event1');
    eventEmitter.emit('event2');
    eventEmitter.emit('event1');
    eventEmitter.emit('event2');
    eventEmitter.emit('event1');
    eventEmitter.emit('event2', function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(called, 13);
      assert.strictEqual(eventEmitter._events.event1.length, 1);
      assert.strictEqual(eventEmitter._events.event2.length, 2);
      done();
    });
  });

  it('should execute tasks which does not have callback', function(done) {
    var order = [];
    var eventEmitter = new async.EventEmitter();
    eventEmitter.on('event', function() {
      order.push('event1');
    });
    eventEmitter.on('event', function(done) {
      order.push('event2');
      done();
    });
    eventEmitter.once('event', function() {
      order.push('event3');
    });
    eventEmitter.once('event', function(done) {
      order.push('event4');
      done();
    });
    eventEmitter.emit('event', function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [
        'event1',
        'event2',
        'event3',
        'event4'
      ]);
      done();
    });
  });

  it('should throw error and not remove tasks', function(done) {
    var order = [];
    var eventEmitter = new async.EventEmitter();
    eventEmitter.once('event', function() {
      order.push('event1');
    });
    eventEmitter.once('event', function(done) {
      order.push('event2');
      done(new Error('error'));
    });
    eventEmitter.emit('event', function(err) {
      assert.strictEqual(err.message, 'error');
      eventEmitter.emit('event', function(err) {
        assert.strictEqual(err.message, 'error');
        assert.deepEqual(order, [
          'event1',
          'event2',
          'event1',
          'event2'
        ]);
        done();
      });
    });
  });

  it('should remove once event', function(done) {
    var order = [];
    var eventEmitter = new async.EventEmitter();
    eventEmitter.on('event', function e1() {
      order.push('event1');
    });
    var event2 = function e2() {
      order.push('event2');
    };
    var event3 = function e3() {
      order.push('event3');
    };
    eventEmitter.on('event', event2);
    eventEmitter.once('event', event3);
    eventEmitter.emit('event');
    eventEmitter.emit('event');
    eventEmitter.off('event', event2);
    eventEmitter.off('event', event2);
    eventEmitter.off('event', event2);
    eventEmitter.off({
      'event': [event3]
    });
    eventEmitter.emit('event');
    setTimeout(function() {
      assert.deepEqual(order, [
        'event1',
        'event2',
        'event3',
        'event1',
        'event2',
        'event1'
      ]);
      done();
    }, delay);
  });

  it('should remove all events in this key', function() {
    var eventEmitter = new async.EventEmitter();
    var event1 = function() {};
    var event2 = function() {};
    eventEmitter.on('event1', event1);
    eventEmitter.on({
      event1: event1,
      event2: event2
    });
    eventEmitter.removeEvent('event1');
    assert.deepEqual(eventEmitter.getListeners(), {
      event2: [event2]
    });
  });

  it('should remove all events', function() {
    var eventEmitter = new async.EventEmitter();
    var event1 = function() {};
    var event2 = function() {};
    eventEmitter.on('event1', event1);
    eventEmitter.on({
      event1: event1,
      event2: event2
    });
    eventEmitter.removeEvent();
    assert.deepEqual(eventEmitter.getListeners(), {});
  });
});
