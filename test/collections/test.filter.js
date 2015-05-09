/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = global.async || require('../../');
var delay = require('../config').delay;
var domain = require('domain').create();
var errorCallCount = 0;
domain.on('error', function(err) {
  errorCallCount++;
  assert.strictEqual(err.message, 'Callback was already called.');
});

function filterIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(num % 2);
    }, num * delay);
  };
}

function filterIteratorWithError(order) {

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
      callback(num % 2);
    }, num * delay);
  };
}

function filterIteratorWithKeyAndError(order) {

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

describe('#filter', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filter(collection, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filter(collection, filterIteratorWithKey(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filter(collection, filterIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filter(collection, filterIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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
    async.filter(collection, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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
    async.filter(collection, filterIteratorWithKey(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [4, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.filter(collection, filterIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.filter(collection, filterIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [4, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };
    async.filter(collection, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1.1, 2.6]);
      assert.deepEqual(order, [1, 3, 4]);
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
      assert.deepEqual(res, [1, 2]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var collection = [1, 3, 2, 4];
      var iterator = function(num, callback) {
        process.nextTick(callback);
        process.nextTick(callback);
      };
      async.filter(collection, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
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
        assert.deepEqual(res, []);
      });
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filter([], filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filter(function() {}, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filter(undefined, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.filter(null, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });
});

describe('#filterSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filterSeries(collection, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filterSeries(collection, filterIteratorWithKey(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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

  it('should execute iterator to series by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filterSeries(collection, filterIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filterSeries(collection, filterIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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
    async.filterSeries(collection, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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
    async.filterSeries(collection, filterIteratorWithKey(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of object and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.filterSeries(collection, filterIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.filterSeries(collection, filterIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.filterSeries(collection, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1.1, 2.6]);
      assert.deepEqual(order, [1, 4, 3]);
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
    async.filterSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, [1]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var collection = [1, 3, 2, 4];
      var iterator = function(num, callback) {
        process.nextTick(callback);
        process.nextTick(callback);
      };
      async.filterSeries(collection, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
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
        assert.deepEqual(res, []);
      });
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filterSeries([], filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filterSeries(function() {}, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filterSeries(undefined, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.filterSeries(null, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#filterLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.filterLimit(collection, 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 5, 3]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.filterLimit(collection, 2, filterIteratorWithKey(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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

  it('should execute iterator in limited by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.filterLimit(collection, 2, filterIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 5, 3]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.filterLimit(collection, 2, filterIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.filterLimit(collection, 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 5, 3]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.filterLimit(collection, 2, filterIteratorWithKey(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
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

  it('should execute iterator to series with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };
    async.filterLimit(collection, 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1.1, 2.7]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.filterLimit(collection, Infinity, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 3, 1]);
      assert.deepEqual(order, [1, 1, 2, 3, 3, 4]);
      done();
    });
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

    errorCallCount = 0;
    domain.run(function() {
      var collection = [1, 5, 3, 2, 4];
      var iterator = function(num, callback) {
        process.nextTick(callback);
        process.nextTick(callback);
      };
      async.filterLimit(collection, 2, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 5);
      done();
    }, delay);
  });

  it('should throw error if callback has 2rd argument and called twice', function(done) {

    errorCallCount = 0;
    domain.run(function() {
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
        assert.deepEqual(res, []);
      });
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 5);
      done();
    }, delay);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filterLimit([], 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is empty object', function(done) {

    var order = [];
    async.filterLimit({}, 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filterLimit(function() {}, 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filterLimit(undefined, 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.filterLimit(null, 2, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.filterLimit(collection, 0, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.filterLimit(collection, undefined, filterIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});
