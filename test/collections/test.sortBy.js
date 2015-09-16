/* global it */
'use strict';

var domain = require('domain');

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function sortByIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(null, num * 2);
    }, num * delay);
  };
}

function sortByIteratorWithKey(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(null, num * 2);
    }, num * delay);
  };
}

parallel('#sortBy', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBy(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2],
        [3, 1]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBy(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.sortBy(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1.1, 2.7, 3.5]);
      assert.deepEqual(order, [1.1, 2.7, 3.5]);
      done();
    }, Math);
  });

  it('should throw error', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortBy(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2];
        var iterator = function(num, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.sortBy(collection, iterator);
      });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.sortBy(function() {}, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.sortBy(undefined, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.sortBy(null, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});

parallel('#sortBySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBySeries(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
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
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBySeries(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.sortBySeries(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
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
      c: 2.7
    };

    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1.1, 2.7, 3.5]);
      assert.deepEqual(order, [1.1, 3.5, 2.7]);
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
    var iterator = function(num, key, callback) {
      callback(null, num % 2);
    };
    async.sortBySeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(res, [2, 1, 3]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortBySeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2];
        var iterator = function(num, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.sortBySeries(collection, iterator);
      });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, index, callback) {
      setTimeout(function() {
        order.push([num, index]);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortBySeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [
        [1, 0],
        [3, 1]
      ]);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.sortBySeries(function() {}, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.sortBySeries(undefined, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.sortBySeries(null, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});

parallel('#sortByLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.sortByLimit(collection, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3, 4, 5]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.sortByLimit(collection, 2, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3, 4, 5]);
      assert.deepEqual(order, [
        [1, 0],
        [3, 2],
        [5, 1],
        [2, 3],
        [4, 4]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.sortByLimit(collection, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3, 4, 5]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.sortByLimit(collection, 2, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3, 4, 5]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'd'],
        [4, 'e']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 3);
    collection.set('d', 2);
    collection.set('e', 4);
    async.sortByLimit(collection, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3, 4, 5]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 3);
    collection.set('d', 2);
    collection.set('e', 4);
    async.sortByLimit(collection, 2, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3, 4, 5]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'd'],
        [4, 'e']
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.sortByLimit(collection, 5, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1.1, 2.7, 3.5]);
      assert.deepEqual(order, [1.1, 2.7, 3.5]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 5, 3];
    async.sortByLimit(collection, Infinity, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 5]);
      assert.deepEqual(order, [1, 3, 5]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = {
      a: 1,
      b: 3,
      c: 2,
      d: 4,
      e: 5
    };
    var iterator = function(num, key, callback) {
      callback(null, num % 2);
    };
    async.sortByLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(res, [2, 4, 1, 3, 5]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortByLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2];
        var iterator = function(num, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.sortByLimit(collection, 2, iterator);
      });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3];
    var iterator = function(num, index, callback) {
      setTimeout(function() {
        order.push([num, index]);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortByLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [
        [1, 0],
        [3, 2]
      ]);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.sortByLimit(function() {}, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.sortByLimit(undefined, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.sortByLimit(null, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortByLimit(collection, 0, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortByLimit(collection, undefined, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});
