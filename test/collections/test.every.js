/* global it */
'use strict';

var domain = require('domain');

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function everyIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(null, num % 2);
    }, num * delay);
  };
}

function everyIteratorWithKey(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(null, num % 2);
    }, num * delay);
  };
}

parallel('#every', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 1, 3, 5]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [2]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 4);
    collection.set('b', 3);
    collection.set('c', 2);
    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [2]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 4);
    collection.set('b', 3);
    collection.set('c', 2);
    async.every(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1.1, 2.6, 3.5]);
      done();
    }, Math);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.every([], everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.every(function() {}, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.every(undefined, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.every(null, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

});

parallel('#everySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 3, 1, 5]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [4]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.everySeries(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [4, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 4);
    collection.set('b', 3);
    collection.set('c', 2);
    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [4]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 4);
    collection.set('b', 3);
    collection.set('c', 2);
    async.everySeries(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [4, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1.1, 3.5, 2.6]);
      done();
    }, Math);
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    var iterator = function(n, key, callback) {
      callback(null, true);
    };
    async.everySeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, true);
      done();
    });
    sync = false;
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2, 4];
        var iterator = function(num, callback) {
          process.nextTick(function() {
            callback(null, true);
          });
          process.nextTick(function() {
            callback(null, true);
          });
        };
        async.everySeries(collection, iterator);
      });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.everySeries([], everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.everySeries(function() {}, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.everySeries(undefined, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.everySeries(null, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

});

parallel('#everyLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array passing index', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 2,
      d: 4
    };
    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 2,
      d: 4
    };
    async.everyLimit(collection, 2, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 'a'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 2);
    collection.set('d', 4);
    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 2);
    collection.set('d', 4);
    async.everyLimit(collection, 2, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, [
        [1, 'a'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1.1, 3.5, 2.6]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 9, 5];
    async.everyLimit(collection, Infinity, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 3, 5, 9]);
      done();
    });

  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.everyLimit([], 4, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.everyLimit(function() {}, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.everyLimit(undefined, 0, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.everyLimit(null, 0, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.everyLimit(collection, 0, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.everyLimit(collection, undefined, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepEqual(order, []);
      done();
    });
  });

});
