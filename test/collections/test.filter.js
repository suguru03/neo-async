/* global it */
'use strict';

var domain = require('domain');

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function filterIterator(order) {

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

function filterIteratorWithKey(order) {

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

parallel('#filter', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filter(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filter(collection, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2],
        [3, 1],
        [4, 3]
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
    async.filter(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 1);
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [2, 3, 4]);
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
    async.filter(collection, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 1);
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b'],
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
    async.filter(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 1);
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 4);
    collection.set('b', 3);
    collection.set('c', 2);
    async.filter(collection, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 1);
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b'],
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
    async.filter(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1.1, 3.5, 2.6]);
      assert.deepEqual(order, [1.1, 2.6, 3.5]);
      done();
    }, Math);
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, true);
      }, num * delay);
    };
    async.filter(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 2]);
      done();
    });
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.filter(collection, iterator);
      });
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.filter(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
          assert.strictEqual(res.length, 0);
          assert.deepEqual(res, []);
        });
      });
  });

  it('should not throw error of double callback', function(done) {

    var collection = [
      'dir1',
      'dir2',
      'file1',
      'file2'
    ];
    var iterator = function(name, callback) {
      var result = name.charAt(0) === 'd';
      callback(null, result);
    };
    var called = false;
    async.filter(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(called, false);
      called = true;
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, ['dir1', 'dir2']);
      setImmediate(done);
    });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filter([], filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filter(function() {}, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filter(undefined, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.filter(null, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });
});

parallel('#filterSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filterSeries(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filterSeries(collection, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2],
        [4, 3]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.filterSeries(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.filterSeries(collection, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.filterSeries(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.filterSeries(collection, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.filterSeries(collection, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1.1, 3.5, 2.6]);
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
    var iterator = function(n, callback) {
      callback(null, true);
    };
    async.filterSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(res, [1, 3, 2]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, true);
      }, num * delay);
    };
    async.filterSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res.length, 1);
      assert.deepEqual(res, [1]);
      done();
    });
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.filterSeries(collection, iterator);
      });
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.filterSeries(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
          assert.strictEqual(res.length, 0);
          assert.deepEqual(res, []);
        });
      });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filterSeries([], filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filterSeries(function() {}, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filterSeries(undefined, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.filterSeries(null, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});

parallel('#filterLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.filterLimit(collection, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1, 5, 3]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.filterLimit(collection, 2, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1, 5, 3]);
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

  it('should execute iterator in limited by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.filterLimit(collection, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1, 5, 3]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.filterLimit(collection, 2, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1, 5, 3]);
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

  it('should execute iterator in limited by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 3);
    collection.set('d', 2);
    collection.set('e', 4);
    async.filterLimit(collection, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1, 5, 3]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 3);
    collection.set('d', 2);
    collection.set('e', 4);
    async.filterLimit(collection, 2, filterIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1, 5, 3]);
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

  it('should execute iterator in limited without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };
    async.filterLimit(collection, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 3);
      assert.deepEqual(res, [1.1, 3.5, 2.7]);
      assert.deepEqual(order, [1.1, 3.5, 2.7]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.filterLimit(collection, Infinity, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 4);
      assert.deepEqual(res, [1, 3, 3, 1]);
      assert.deepEqual(order, [1, 1, 2, 3, 3, 4]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = [1, 3, 4, 2, 3, 1];
    var iterator = function(n, callback) {
      callback(null, n % 2);
    };
    async.filterLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(res, [1, 3, 3, 1]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(num, index, callback) {
      setTimeout(function() {
        order.push([num, index]);
        callback(num === 5, num % 2);
      }, num * delay);
    };

    async.filterLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 2);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 0],
        [3, 2],
        [5, 1]
      ]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 5);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 5, 3, 2, 4];
        var iterator = function(num, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.filterLimit(collection, 2, iterator);
      });
  });

  it('should throw error if callback has 2rd argument and called twice', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 5);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 5, 3, 2, 4];
        var iterator = function(num, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.filterLimit(collection, 2, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
          assert.strictEqual(res.length, 0);
          assert.deepEqual(res, []);
        });
      });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filterLimit([], 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is empty object', function(done) {

    var order = [];
    async.filterLimit({}, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filterLimit(function() {}, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filterLimit(undefined, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.filterLimit(null, 2, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.filterLimit(collection, 0, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.filterLimit(collection, undefined, filterIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.strictEqual(res.length, 0);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});
