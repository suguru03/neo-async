/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');

function createTasks(order, numbers) {

  return _.transform(numbers, function(memo, num, index) {

    memo[index] = function(callback) {

      var self = this;

      setTimeout(function() {

        order.push(num);
        if (self && self.round) {
          num = self.round(num);
        }
        callback(null, num * 2);
      }, num * 30);
    };
  });
}

describe('#parallel', function() {

  it('should execute in parallel by tasks of array', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);
    tasks.push(function(cb) {
      setTimeout(function() {
        order.push(5);
        cb(null, 5, 5);
      }, 150);
    });

    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4, 8, [5, 5]]);
      assert.deepEqual(order, [1, 2, 3, 4, 5]);
      done();
    });
  });

  it('should execute in parallel by tasks of object', function(done) {

    var order = [];
    var numbers = {
      a: 4,
      b: 2,
      c: 1,
      d: 3
    };
    var tasks = createTasks(order, numbers);

    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        c: 2,
        b: 4,
        d: 6,
        a: 8
      });
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute in parallel by tasks of array with binding', function(done) {

    var order = [];
    var numbers = [1.2, 2.4, 1.5, 3.6];
    var tasks = createTasks(order, numbers);

    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 4, 4, 8]);
      assert.deepEqual(order, [1.2, 1.5, 2.4, 3.6]);
      done();
    }, Math);
  });

  it('should execute in parallel by tasks of object with binding', function(done) {

    var order = [];
    var numbers = {
      a: 1.2,
      b: 2.4,
      c: 1.5,
      d: 3.6
    };
    var tasks = createTasks(order, numbers);

    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        c: 4,
        b: 4,
        d: 8
      });
      assert.deepEqual(order, [1.2, 1.5, 2.4, 3.6]);
      done();
    }, Math);
  });

  it('should return response immediately if array task is empty', function(done) {

    var tasks = [];
    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object task is empty', function(done) {

    var tasks = {};
    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      done();
    });
  });

  it('should return response immediately if task is not collection', function(done) {

    async.parallel(null, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);
    var error = function(callback) {
      setTimeout(function() {
        callback('error');
      }, 75);
    };
    tasks.splice(2, 0, error);

    async.parallel(tasks, function(err) {
      assert.ok(err);
      assert.deepEqual(order, [1, 2]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var tasks = [function(next) {
      next();
      next();
    }];

    try {
      async.parallel(tasks);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should throw error only once', function(done) {

    var error = function(callback) {
      setTimeout(function() {
        callback('error');
      }, 25);
    };
    var called = false;
    var tasks = [error, error, error, error];
    async.parallel(tasks, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      setTimeout(done, 50);
    });
  });
});

describe('#parallelLimit', function() {

  it('should execute in limited by tasks of array', function(done) {

    var order = [];
    var numbers = [1, 4, 2, 3, 1];
    var tasks = createTasks(order, numbers);
    tasks.push(function(cb) {
      setTimeout(function() {
        order.push(5);
        cb(null, 5, 5);
      }, 50);
    });

    async.parallelLimit(tasks, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 8, 4, 6, 2, [5, 5]]);
      assert.deepEqual(order, [1, 2, 4, 1, 3, 5]);
      done();
    });
  });

  it('should execute in limited by tasks of object', function(done) {

    var order = [];
    var numbers = {
      a: 4,
      b: 2,
      c: 1,
      d: 3,
      e: 1
    };
    var tasks = createTasks(order, numbers);

    async.parallelLimit(tasks, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        b: 4,
        a: 8,
        c: 2,
        d: 6,
        e: 2
      });
      assert.deepEqual(order, [2, 1, 4, 1, 3]);
      done();
    });
  });

  it('should execute in parallel by tasks of array with binding', function(done) {

    var order = [];
    var numbers = [1.2, 2.4, 1.5, 3.6];
    var tasks = createTasks(order, numbers);

    async.parallelLimit(tasks, 3, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 4, 4, 8]);
      assert.deepEqual(order, [1.2, 1.5, 2.4, 3.6]);
      done();
    }, Math);
  });

  it('should execute in parallel by tasks of object with binding', function(done) {

    var order = [];
    var numbers = {
      a: 1.2,
      b: 2.4,
      c: 1.5,
      d: 3.6
    };
    var tasks = createTasks(order, numbers);

    async.parallelLimit(tasks, 3, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        c: 4,
        b: 4,
        d: 8
      });
      assert.deepEqual(order, [1.2, 1.5, 2.4, 3.6]);
      done();
    }, Math);
  });

  it('should return response immediately if array task is empty', function(done) {

    var tasks = [];
    async.parallelLimit(tasks, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      done();
    });

  });

  it('should return response immediately if object task is empty', function(done) {

    var tasks = {};
    async.parallelLimit(tasks, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      done();
    });

  });

  it('should return response immediately if task is not collection', function(done) {

    async.parallelLimit(null, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      done();
    });

  });

  it('should throw error', function(done) {

    var order = [];
    var numbers = [1, 3, 2, 4];
    var tasks = createTasks(order, numbers);
    var error = function(callback) {
      setTimeout(function() {
        callback('error');
      }, 75);
    };
    tasks.splice(2, 0, error);

    async.parallelLimit(tasks, 2, function(err) {
      assert.ok(err);
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var tasks = [function(next) {
      next();
      next();
    }];

    try {
      async.parallelLimit(tasks, 4);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

});
