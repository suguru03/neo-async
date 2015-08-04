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

function mapIterator(order) {

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

function mapIteratorWithKey(order) {

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

describe('#map', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.map(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
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
    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
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
    async.map(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
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

    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2.2, 7, 5.4]);
      assert.deepEqual(order, [1.1, 2.7, 3.5]);
      done();
    }, Math);
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };

    async.map(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, [1, 3, 2, undefined]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var collection = [1, 3];
      var iterator = function(num, callback) {
        process.nextTick(function() {
          callback(null, num);
        });
        process.nextTick(function() {
          callback(null, num);
        });
      };
      async.map(collection, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 2);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.map(array, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.map(object, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.map(function() {}, mapIterator(order), function(err, res) {
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
    async.map(undefined, mapIterator(order), function(err, res) {
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
    async.map(null, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#mapSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, [2, 6, 4]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapSeries(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, [2, 6, 4]);
      assert.deepEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2]
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
    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
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
    async.mapSeries(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
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
      c: 2.7
    };

    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2.2, 7, 5.4]);
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
    var iterator = function(n, callback) {
      callback(null, n);
    };
    async.mapSeries(collection, iterator, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(result, [1, 3, 2]);
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
        callback(num === 3, num);
      }, num * delay);
    };

    async.mapSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, [1, 3, undefined, undefined]);
      assert.deepEqual(order, [1, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var collection = [1, 3];
      var iterator = function(num, callback) {
        process.nextTick(function() {
          callback(null, num);
        });
        process.nextTick(function() {
          callback(null, num);
        });
      };
      async.mapSeries(collection, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 2);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapSeries(array, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapSeries(object, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapSeries(function() {}, mapIterator(order), function(err, res) {
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
    async.mapSeries(undefined, mapIterator(order), function(err, res) {
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
    async.mapSeries(null, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#mapLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.mapLimit(collection, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 10, 6, 8, 4]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.mapLimit(collection, 2, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 10, 6, 8, 4]);
      assert.deepEqual(order, [
        [1, 0],
        [3, 2],
        [5, 1],
        [2, 4],
        [4, 3]
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
      d: 4,
      e: 2
    };
    async.mapLimit(collection, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 10, 6, 8, 4]);
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
      d: 4,
      e: 2
    };
    async.mapLimit(collection, 2, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 10, 6, 8, 4]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'e'],
        [4, 'd']
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

    async.mapLimit(collection, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2.2, 7, 5.4]);
      assert.deepEqual(order, [1.1, 3.5, 2.7]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3];

    async.mapLimit(collection, Infinity, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 8, 4, 6]);
      assert.deepEqual(order, [1, 2, 3, 3, 4]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    var iterator = function(n, callback) {
      callback(null, n);
    };
    async.mapLimit(collection, 2, iterator, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(result, [1, 5, 3, 4, 2]);
      done();
    });
    sync = false;
  });


  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };

    async.mapLimit(collection, 4, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, [1, 3, undefined, 2, undefined, undefined]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var collection = [1, 3, 2];
      var iterator = function(num, callback) {
        process.nextTick(function() {
          callback(null, num);
        });
        process.nextTick(function() {
          callback(null, num);
        });
      };
      async.mapLimit(collection, 2, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapLimit(array, 3, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapLimit(object, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapLimit(function() {}, 3, mapIterator(order), function(err, res) {
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
    async.mapLimit(undefined, 3, mapIterator(order), function(err, res) {
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
    async.mapLimit(null, 3, mapIterator(order), function(err, res) {
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
    async.mapLimit(collection, 0, mapIterator(order), function(err, res) {
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
    async.mapLimit(collection, undefined, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});
