/* global it */
'use strict';

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function someIterator(order) {

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

function someIteratorWithKey(order) {

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

parallel('#some', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [1, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.some(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.some(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 5);
    collection.set('b', 3);
    collection.set('c', 2);
    async.some(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 5);
    collection.set('b', 3);
    collection.set('c', 2);
    async.some(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
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
      c: 2.6
    };

    async.some(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1.1]);
      done();
    }, Math);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.some([], someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.some(function() {}, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.some(undefined, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.some(null, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.some(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

});

parallel('#someSeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [1, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.someSeries(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [5]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.someSeries(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [5, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 5);
    collection.set('b', 3);
    collection.set('c', 2);
    async.someSeries(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [5]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 5);
    collection.set('b', 3);
    collection.set('c', 2);
    async.someSeries(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [5, 'a']
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

    async.someSeries(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1.1]);
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
      callback(null, key === 'c');
    };
    async.someSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, true);
      done();
    });
    sync = false;
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.someSeries([], someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.someSeries(function() {}, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.someSeries(undefined, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.someSeries(null, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.someSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

});

parallel('#someLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 0],
        [4, 1],
        [3, 2]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.someLimit(collection, 2, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 'a'],
        [4, 'b'],
        [3, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 2);
    collection.set('b', 4);
    collection.set('c', 3);
    collection.set('d', 2);
    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 2);
    collection.set('b', 4);
    collection.set('c', 3);
    collection.set('d', 2);
    async.someLimit(collection, 2, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 'a'],
        [4, 'b'],
        [3, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1.1]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [2, 3, 1];

    async.someLimit(collection, Infinity, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1]);
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
    var iterator = function(n, key, callback) {
      callback(null, key === 'e');
    };
    async.someLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, true);
      done();
    });
    sync = false;
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.someLimit([], 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.someLimit(function() {}, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.someLimit(undefined, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.someLimit(null, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.someLimit(collection, 0, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.someLimit(collection, undefined, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.someLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

});
