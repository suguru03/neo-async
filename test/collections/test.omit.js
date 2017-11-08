/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function omitIterator(order) {

  return function(value, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(value);
      callback(null, num % 2);
    }, num * delay);
  };
}

function omitIteratorWithKey(order) {

  return function(value, key, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([value, key]);
      callback(null, num % 2);
    }, num * delay);
  };
}

parallel('#omit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.omit(collection, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '2': 2,
        '3': 4
      });
      assert.deepStrictEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.omit(collection, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '2': 2,
        '3': 4
      });
      assert.deepStrictEqual(order, [
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
    async.omit(collection, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        a: 4,
        c: 2
      });
      assert.deepStrictEqual(order, [2, 3, 4]);
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
    async.omit(collection, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        a: 4,
        c: 2
      });
      assert.deepStrictEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [4, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.omit(set, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': 4,
        '2': 2
      });
      assert.deepStrictEqual(order, [2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.omit(set, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': 4,
        '2': 2
      });
      assert.deepStrictEqual(order, [
        [2, 2],
        [3, 1],
        [4, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.omit(map, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': ['a', 4],
        '2': ['c', 2]
      });
      assert.deepStrictEqual(order, [
        ['c', 2],
        ['b', 3],
        ['a', 4]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.omit(map, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': ['a', 4],
        '2': ['c', 2]
      });
      assert.deepStrictEqual(order, [
        [['c', 2], 2],
        [['b', 3], 1],
        [['a', 4], 0]
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

    async.omit(collection, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [1.1, 2.6, 3.5]);
      done();
    }, Math);
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num % 2);
      }, num * delay);
    };

    async.omit(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '2': 2
      });
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2,
      d: 4
    };
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num % 2);
      }, num * delay);
    };

    async.omit(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        c: 2
      });
      assert.deepStrictEqual(order, [1, 2, 3]);
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
        var collection = [2, 1, 3];
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omit(collection, iterator);
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
        var collection = [2, 1, 3];
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omit(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
          assert.deepStrictEqual(res, {
            '0': 2,
            '1': 1,
            '2': 3
          });
        });
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
        var collection = {
          a: 4,
          b: 3,
          c: 2
        };
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omit(collection, iterator);
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
        var collection = {
          a: 4,
          b: 3,
          c: 2
        };
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omit(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
          assert.deepStrictEqual(res, {
            a: 4,
            b: 3,
            c: 2
          });
        });
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.omit([1, 2, 3], function(item, callback) {
      try {
        callback(item);
      } catch (exception) {
        try {
          callback(exception);
        } catch(e) {
          assert.ok(e);
          util.errorChecker(e);
          done();
        }
      }
    }, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.omit(array, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.omit(object, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.omit(function() {}, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.omit(undefined, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.omit(null, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#omitSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.omitSeries(collection, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '2': 2,
        '3': 4
      });
      assert.deepStrictEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.omitSeries(collection, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '2': 2,
        '3': 4
      });
      assert.deepStrictEqual(order, [
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
      a: 4,
      b: 3,
      c: 2
    };
    async.omitSeries(collection, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        a: 4,
        c: 2
      });
      assert.deepStrictEqual(order, [4, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.omitSeries(collection, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        a: 4,
        c: 2
      });
      assert.deepStrictEqual(order, [
        [4, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.omitSeries(set, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': 4,
        '2': 2
      });
      assert.deepStrictEqual(order, [4, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.omitSeries(set, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': 4,
        '2': 2
      });
      assert.deepStrictEqual(order, [
        [4, 0],
        [3, 1],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.omitSeries(map, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': ['a', 4],
        '2': ['c', 2]
      });
      assert.deepStrictEqual(order, [
        ['a', 4],
        ['b', 3],
        ['c', 2]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.omitSeries(map, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '0': ['a', 4],
        '2': ['c', 2]
      });
      assert.deepStrictEqual(order, [
        [['a', 4], 0],
        [['b', 3], 1],
        [['c', 2], 2]
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

    async.omitSeries(collection, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [1.1, 3.5, 2.6]);
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
      callback(null, n % 2);
    };
    async.omitSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(res, {
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
        callback(num === 3, num % 2);
      }, num * delay);
    };

    async.omitSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [1, 3]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2,
      d: 4
    };
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num % 2);
      }, num * delay);
    };

    async.omitSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [1, 3]);
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
        var collection = [2, 1, 3];
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitSeries(collection, iterator);
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
        var collection = [2, 1, 3];
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitSeries(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
          assert.deepStrictEqual(res, {
            '0': 2,
            '1': 1,
            '2': 3
          });
        });
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
        var collection = {
          a: 4,
          b: 3,
          c: 2
        };
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitSeries(collection, iterator);
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
        var collection = {
          a: 4,
          b: 3,
          c: 2
        };
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitSeries(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
          assert.deepStrictEqual(res, {
            a: 4,
            b: 3,
            c: 2
          });
        });
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.omitSeries([1, 2, 3], function(item, callback) {
      try {
        callback(item);
      } catch (exception) {
        try {
          callback(exception);
        } catch(e) {
          assert.ok(e);
          util.errorChecker(e);
          done();
        }
      }
    }, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.omitSeries(array, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.omitSeries(object, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.omitSeries(function() {}, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.omitSeries(undefined, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.omitSeries(null, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#omitLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.omitLimit(collection, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '3': 2,
        '4': 4
      });
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.omitLimit(collection, 2, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '3': 2,
        '4': 4
      });
      assert.deepStrictEqual(order, [
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
    async.omitLimit(collection, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        d: 2,
        e: 4
      });
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
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
    async.omitLimit(collection, 2, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        d: 2,
        e: 4
      });
      assert.deepStrictEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'd'],
        [4, 'e']
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(5);
    set.add(3);
    set.add(2);
    set.add(4);
    async.omitLimit(set, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '3': 2,
        '4': 4
      });
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(5);
    set.add(3);
    set.add(2);
    set.add(4);
    async.omitLimit(set, 2, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '3': 2,
        '4': 4
      });
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 2],
        [5, 1],
        [2, 3],
        [4, 4]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 5);
    map.set('c', 3);
    map.set('d', 2);
    map.set('e', 4);
    async.omitLimit(map, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '3': ['d', 2],
        '4': ['e', 4]
      });
      assert.deepStrictEqual(order, [
        ['a', 1],
        ['c', 3],
        ['b', 5],
        ['d', 2],
        ['e', 4]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 5);
    map.set('c', 3);
    map.set('d', 2);
    map.set('e', 4);
    async.omitLimit(map, 2, omitIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '3': ['d', 2],
        '4': ['e', 4]
      });
      assert.deepStrictEqual(order, [
        [['a', 1], 0],
        [['c', 3], 2],
        [['b', 5], 1],
        [['d', 2], 3],
        [['e', 4], 4]
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

    async.omitLimit(collection, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [1.1, 3.5, 2.7]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1, 3];

    async.omitLimit(collection, Infinity, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '2': 4,
        '3': 2
      });
      assert.deepStrictEqual(order, [1, 1, 2, 3, 3, 3, 4]);
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
      callback(null, n % 2);
    };
    async.omitLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(res, {
        c: 2,
        d: 4
      });
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 1,
      c: 3
    };
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 2, num);
      }, num * delay);
    };
    async.omitLimit(collection, 4, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [1, 2]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [2, 1, 3];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 2, num);
      }, num * delay);
    };
    async.omitLimit(collection, 4, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [1, 2]);
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
        var collection = [2, 1, 3];
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitLimit(collection, 4, iterator);
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
        var collection = [2, 1, 3];
        var iterator = function(item, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitLimit(collection, 4, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
          assert.deepStrictEqual(res, {
            '0': 2,
            '1': 1,
            '2': 3
          });
        });
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
        var collection = {
          a: 2,
          b: 1,
          c: 3
        };
        var iterator = function(item, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitLimit(collection, 4, iterator);
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
        var collection = {
          a: 2,
          b: 1,
          c: 3
        };
        var iterator = function(item, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.omitLimit(collection, 4, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
          assert.deepStrictEqual(res, {
            a: 2,
            b: 1,
            c: 3
          });
        });
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.omitLimit([1, 2, 3], 2, function(item, callback) {
      try {
        callback(item);
      } catch (exception) {
        try {
          callback(exception);
        } catch(e) {
          assert.ok(e);
          util.errorChecker(e);
          done();
        }
      }
    }, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.omitLimit(array, 3, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.omitLimit(object, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.omitLimit(function() {}, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.omitLimit(undefined, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.omitLimit(null, 2, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.omitLimit(collection, 0, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.omitLimit(collection, undefined, omitIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});
