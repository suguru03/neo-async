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

function detectIterator(order) {

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

function detectIteratorWithError(order) {

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

function detectIteratorWithKey(order) {

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

function detectIteratorWithKeyAndError(order) {

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

describe('#detect', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detect(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, 1);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detect(collection, detectIteratorWithKey(order), function(res) {
      assert.strictEqual(res, 1);
      assert.deepEqual(order, [
        [1, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detect(collection, detectIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detect(collection, detectIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1);
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
    async.detect(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, 3);
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
    async.detect(collection, detectIteratorWithKey(order), function(res) {
      assert.strictEqual(res, 3);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.detect(collection, detectIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.detect(collection, detectIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b']
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

    async.detect(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, 1.1);
      assert.deepEqual(order, [1]);
      done();
    }, Math);
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 6, 4];

    async.detect(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [2, 4, 6]);
      done();
    });
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 6, 4];

    async.detect(collection, detectIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [2, 4, 6]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, false);
      }, num * delay);
    };
    async.detect(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
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
      async.detect(collection, iterator);
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
      async.detect(collection, iterator, function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(res, undefined);
      });
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.detect(array, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.detect(object, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.detect(function() {}, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.detect(undefined, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.detect(null, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#detectSeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detectSeries(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, 1);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detectSeries(collection, detectIteratorWithKey(order), function(res) {
      assert.strictEqual(res, 1);
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
    async.detectSeries(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, 5);
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
    async.detectSeries(collection, detectIteratorWithKey(order), function(res) {
      assert.strictEqual(res, 5);
      assert.deepEqual(order, [
        [5, 'a']
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

    async.detectSeries(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, 1.1);
      assert.deepEqual(order, [1]);
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
      callback(key === 'c');
    };
    async.detectSeries(collection, iterator, function(res) {
      assert.strictEqual(sync, false);
      assert.strictEqual(res, 2);
      done();
    });
    sync = false;
  });

  it('should execute on asynchronous and get 2rd callback argument', function(done) {

    var sync = true;
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    var iterator = function(n, key, callback) {
      callback(null, key === 'c');
    };
    async.detectSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, 2);
      done();
    });
    sync = false;
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 6, 4];

    async.detectSeries(collection, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [2, 6, 4]);
      done();
    });
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 6, 4];

    async.detectSeries(collection, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [
        [2, 0],
        [6, 1],
        [4, 2]
      ]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, false);
      }, num * delay);
    };
    async.detectSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
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
      async.detectSeries(collection, iterator);
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
      async.detectSeries(collection, iterator, function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(res, undefined);
      });
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.detectSeries(array, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.detectSeries(object, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.detectSeries(function() {}, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.detectSeries(undefined, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.detectSeries(null, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#detectLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.detectLimit(collection, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, 3);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.detectLimit(collection, 2, detectIteratorWithKey(order), function(res) {
      assert.strictEqual(res, 3);
      assert.deepEqual(order, [
        [2, 0],
        [4, 1],
        [3, 2]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.detectLimit(collection, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, 3);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.detectLimit(collection, 2, detectIteratorWithKey(order), function(res) {
      assert.strictEqual(res, 3);
      assert.deepEqual(order, [
        [2, 'a'],
        [4, 'b'],
        [3, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series with binding', function(done) {

    var order = [];
    var collection = {
      a: 2.1,
      b: 3.5,
      c: 2.7
    };

    async.detectLimit(collection, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, 2.7);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [2, 3, 1];

    async.detectLimit(collection, Infinity, detectIterator(order), function(res) {
      assert.strictEqual(res, 1);
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
      callback(key === 'e');
    };
    async.detectLimit(collection, 2, iterator, function(res) {
      assert.strictEqual(sync, false);
      assert.strictEqual(res, 5);
      done();
    });
    sync = false;
  });

  it('should execute on asynchronous and get 2rd callback argument', function(done) {

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
    async.detectLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, 5);
      done();
    });
    sync = false;
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 8, 4];

    async.detectLimit(collection, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [2, 4, 8]);
      done();
    });
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 8, 4];

    async.detectLimit(collection, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [2, 4, 8]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 4, 2, 3];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 4, false);
      }, num * delay);
    };
    async.detectLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 2, 4]);
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
      async.detectLimit(collection, 2, iterator);
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
      async.detectLimit(collection, 2, iterator, function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(res, undefined);
      });
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.detectLimit(array, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.detectLimit(object, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.detectLimit(function() {}, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.detectLimit(undefined, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.detectLimit(null, 2, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.detectLimit(collection, 0, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.detectLimit(collection, undefined, detectIterator(order), function(res) {
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, []);
      done();
    });
  });

});
