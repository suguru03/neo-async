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

function mapValuesIterator(order) {

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

function mapValuesIteratorWithKey(order) {

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

describe('#mapValues', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValues(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 4
      });
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValues(collection, mapValuesIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 4
      });
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
    async.mapValues(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 6,
        c: 4
      });
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.mapValues(collection, mapValuesIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 6,
        c: 4
      });
      assert.deepEqual(order, [
        [1, 'a'],
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
      c: 2.7
    };

    async.mapValues(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 8,
        c: 6
      });
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
        callback(num === 3, num);
      }, num * delay);
    };

    async.mapValues(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, {
        '0': 1,
        '1': 3,
        '2': 2
      });
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
      async.mapValues(collection, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 2);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapValues(array, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapValues(object, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapValues(function() {}, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.mapValues(undefined, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.mapValues(null, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#mapValuesSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValuesSeries(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 4
      });
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValuesSeries(collection, mapValuesIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 4
      });
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
    async.mapValuesSeries(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 6,
        c: 4
      });
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
    async.mapValuesSeries(collection, mapValuesIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 6,
        c: 4
      });
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
      c: 2.7
    };

    async.mapValuesSeries(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 8,
        c: 6
      });
      assert.deepEqual(order, [1, 4, 3]);
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
    async.mapValuesSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(res, {
        a: 1,
        b: 3,
        c: 2
      });
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

    async.mapValuesSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, {
        '0': 1,
        '1': 3
      });
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
      async.mapValuesSeries(collection, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 2);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapValuesSeries(array, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapValuesSeries(object, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapValuesSeries(function() {}, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.mapValuesSeries(undefined, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.mapValuesSeries(null, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#mapValuesLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.mapValuesLimit(collection, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 10,
        '2': 6,
        '3': 8,
        '4': 4
      });
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.mapValuesLimit(collection, 2, mapValuesIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 10,
        '2': 6,
        '3': 8,
        '4': 4
      });
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
    async.mapValuesLimit(collection, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 10,
        c: 6,
        d: 8,
        e: 4
      });
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
    async.mapValuesLimit(collection, 2, mapValuesIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 10,
        c: 6,
        d: 8,
        e: 4
      });
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

  it('should execute iterator to series with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.mapValuesLimit(collection, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 8,
        c: 6
      });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3];

    async.mapValuesLimit(collection, Infinity, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 8,
        '3': 4,
        '4': 6
      });
      assert.deepEqual(order, [1, 2, 3, 3, 4]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = [1, 3, 4, 2, 3];
    var iterator = function(n, callback) {
      callback(null, n);
    };
    async.mapValuesSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '0': 1,
        '1': 3,
        '2': 4,
        '3': 2,
        '4': 3
      });
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

    async.mapValuesLimit(collection, 4, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, {
        '0': 1,
        '1': 3,
        '3': 2
      });
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
      async.mapValuesLimit(collection, 2, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapValuesLimit(array, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapValuesLimit(object, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapValuesLimit(function() {}, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.mapValuesLimit(undefined, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.mapValuesLimit(null, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValuesLimit(collection, 0, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValuesLimit(collection, undefined, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

});
