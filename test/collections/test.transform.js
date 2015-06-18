/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = global.async || require('../../');
var delay = require('../config').delay;
var domain = require('domain').create();
var errorCallCount = 0;
domain.on('error', function(err) {
  errorCallCount++;
  assert.strictEqual(err.message, 'Callback was already called.');
});

function transformIterator(order) {

  return function(memo, num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      if (num % 2 === 1) {
        if (_.isArray(memo)) {
          memo.push(num);
        }
      }
      order.push(num);
      callback();
    }, num * delay);
  };
}

function transformIteratorWithKey(order) {

  return function(memo, num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      if (num % 2 === 1) {
        if (_.isArray(memo)) {
          memo.push(num);
        } else {
          memo[key] = num;
        }
      }
      order.push([num, key]);
      if (key === 'break') {
        return callback(null, false);
      }
      callback();
    }, num * delay);
  };
}

describe('#transform', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.transform(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 5]);
      assert.deepEqual(order, [1, 2, 3, 4, 5]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.transform(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 5]);
      assert.deepEqual(order, [
        [1, 0],
        [2, 3],
        [3, 2],
        [4, 4],
        [5, 1]
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
    async.transform(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [3, 5]);
      assert.deepEqual(order, [2, 3, 5]);
      done();
    }, []);
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.transform(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        b: 3,
        a: 5
      });
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [5, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator and break when callback is called "false"', function(done) {

    var order = [];
    var collection = [4, 3, 2];
    var iterator = function(memo, num, callback) {
      setTimeout(function() {
        order.push(num);
        memo.push(num);
        callback(null, num !== 3);
      }, num * delay);
    };
    async.transform(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [2, 3]);
      assert.deepEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator and break when callback is called "false"', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2,
      'break': 3.5
    };
    async.transform(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [3]);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [3.5, 'break']
      ]);
      done();
    }, []);
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.transform(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        a: 1,
        c: 3
      });
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [4, 'b']
      ]);
      done();
    }, {}, Math);
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 4);
      }, value * delay);
    };
    async.transform(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 2, 3, 4]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should return response immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform([], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform({}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.transform(function() {}, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.transform(undefined, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.transform(null, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return accumulator immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform([], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      done();
    }, {});
  });

  it('should return accumulator immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform({}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      done();
    }, []);
  });

});

describe('#transformSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.transformSeries(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.transformSeries(collection, transformIteratorWithKey(order), function(err, res) {
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
      a: 5,
      b: 3,
      c: 2
    };
    async.transformSeries(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [5, 3]);
      assert.deepEqual(order, [5, 3, 2]);
      done();
    }, []);
  });

  it('should execute iterator and break when callback is called "false"', function(done) {

    var order = [];
    var collection = {
      a: 5,
      'break': 3.5,
      b: 3,
      c: 2
    };
    async.transformSeries(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        a: 5
      });
      assert.deepEqual(order, [
        [5, 'a'],
        [3.5, 'break']
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

    async.transformSeries(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        a: 1,
        c: 3
      });
      assert.deepEqual(order, [
        [1, 'a'],
        [4, 'b'],
        [3, 'c']
      ]);
      done();
    }, undefined, Math);
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 4);
      }, value * delay);
    };
    async.transformSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 5, 3, 2, 4]);
      assert.deepEqual(order, [1, 5, 3, 2, 4]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var collection = [1, 3, 2, 4];
      var iterator = function(memo, value, key, callback) {
        process.nextTick(callback);
        process.nextTick(callback);
      };
      async.transformSeries(collection, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

  it('should return response immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries([], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries({}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.transformSeries(function() {}, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.transformSeries(undefined, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.transformSeries(null, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return accumulator immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries([], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      done();
    }, {});
  });

  it('should return accumulator immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries({}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      done();
    }, []);
  });

});

describe('#transformLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.transformLimit(collection, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 5]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.transformLimit(collection, 2, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 5]);
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
    async.transformLimit(collection, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 5]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    }, []);
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
    async.transformLimit(collection, 2, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        a: 1,
        b: 5,
        c: 3
      });
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

  it('should execute iterator in limited and break when callback is called "false"', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2,
      'break': 3.5,
      d: 3
    };
    async.transformLimit(collection, 4, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        b: 3
      });
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [3.5, 'break']
      ]);
      done();
    });

  });

  it('should execute iterator in limited with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.transformLimit(collection, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, [], Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1, 1];

    async.transformLimit(collection, Infinity, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 1, 1, 3, 3]);
      assert.deepEqual(order, [1, 1, 1, 2, 3, 3, 4]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 3);
      }, value * delay);
    };
    async.transformLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3]);
      done();
    });
  });

  it('should return response immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit([], 3, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit({}, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.transformLimit(function() {}, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.transformLimit(undefined, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.transformLimit(null, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.transformLimit(collection, 0, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(order, []);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.transformLimit(collection, undefined, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(order, []);
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return accumulator immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit([], 4, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      done();
    }, {});
  });

  it('should return accumulator immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit({}, 4, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      done();
    }, []);
  });

});
