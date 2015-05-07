/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = global.async || require('../../').safe;
var safeAsync = async === async.noConflict() ? async.safe : async;

describe('#safe', function() {

  describe('#each', function() {

    it('should execute safe iterator many times', function(done) {

      var called = 0;
      var sum = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(num, done) {
        sum += num;
        called++;
        done();
      };
      safeAsync.each(array, syncIterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

    it('should execute safe iterator when iterator has extra arguments', function(done) {

      var called = 0;
      var times = 100;
      var array = _.times(times);
      var iterator = function(num, done, arg3, arg4, arg5, arg6) {
        called++;
        assert.strictEqual(arg3, undefined);
        assert.strictEqual(arg4, undefined);
        assert.strictEqual(arg5, undefined);
        assert.strictEqual(arg6, undefined);
        done();
      };
      async.each(array, iterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        done();
      });
    });

  });

  describe('#eachSeries', function() {

    it('should execute sync iterator many times', function(done) {

      var called = 0;
      var sum = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(num, done) {
        sum += num;
        called++;
        done();
      };
      safeAsync.eachSeries(array, syncIterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

  });

  describe('#reduce', function() {

    it('should execute sync iterator many times', function(done) {

      var called = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(result, num, done) {
        called++;
        done(null, result + num);
      };
      safeAsync.reduce(array, 0, syncIterator, function(err, sum) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

    it('should execute sync iterator with passing index many times', function(done) {

      var called = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(result, num, index, done) {
        called++;
        done(null, result + num);
      };
      safeAsync.reduce(array, 0, syncIterator, function(err, sum) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });

  });

  describe('#parallel', function() {

    it('should execute sync tasks many times', function(done) {

      var called = 0;
      var times = 100000;
      var tasks = {};
      _.times(times, function(n) {
        tasks[n] = function(done) {
          called++;
          done();
        };
      });
      safeAsync.parallel(tasks, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        done();
      });
    });
  });

  describe('#series', function() {

    it('should execute sync tasks many times', function(done) {

      var called = 0;
      var times = 100000;
      var tasks = _.times(times, function() {
        return function(done) {
          called++;
          done();
        };
      });
      safeAsync.series(tasks, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        done();
      });
    });

  });

  describe('#whilst', function() {

    it('should execute until test is false', function(done) {

      var count = 0;
      var called = 0;
      var limit = 10;
      var test = function() {
        return ++count <= limit;
      };
      var iterator = function(callback) {
        called++;
        callback();
      };

      async.whilst(test, iterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(count, limit + 1);
        assert.strictEqual(called, limit);
        done();
      });
    });

  });

  describe('#auto', function() {

    it('should execute in accordance with best order', function(done) {

      var order = [];
      var tasks = {
        task1: ['task2', function(callback) {
          setTimeout(function() {
            order.push('task1');
            callback();
          }, 25);
        }],
        task2: function(callback) {
          setTimeout(function() {
            order.push('task2');
            callback();
          }, 50);
        },
        task3: ['task2', function(callback) {
          order.push('task3');
          callback();
        }],
        task4: ['task1', 'task2', function(callback) {
          order.push('task4');
          callback();
        }],
        task5: ['task2', function(callback) {
          setTimeout(function() {
            order.push('task5');
            callback();
          }, 0);
        }],
        task6: ['task2', function(callback) {
          order.push('task6');
          callback();
        }]
      };

      safeAsync.auto(tasks, function(err) {
        if (err) {
          return done(err);
        }
        assert.deepEqual(order, ['task2', 'task6', 'task3', 'task5', 'task1', 'task4']);
        done();
      });
    });
  });

  describe('#safe', function() {

    it('should create new safe function', function() {
      var safe = safeAsync.safe();
      assert.notStrictEqual(safeAsync, safe);
      assert.deepEqual(_.keys(safeAsync), _.keys(safe));
    });
  });

});
