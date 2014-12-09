/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');

function transformIterator(order) {

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
      order.push(num);

      if (key === 'break') {
        return callback(null, false);
      }

      callback();
    }, num * 10);
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
      assert.deepEqual(res, [1, 3, 5]);
      assert.deepEqual(order, [1, 2, 3, 4, 5]);
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

      assert.deepEqual(res, { b: 3, a: 5 });
      assert.deepEqual(order, [2, 3, 5]);
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
    async.transform(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, { b: 3 });
      assert.deepEqual(order, [2, 3, 3.5]);
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

    async.transform(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { a: 1, c: 3 });
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 4);
      }, value * 10);
    };
    async.transform(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
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
      assert.deepEqual(res, {});
      done();
    });

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
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
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
      assert.deepEqual(res, { a: 5, b: 3 });
      assert.deepEqual(order, [5, 3, 2]);
      done();
    });

  });

  it('should execute iterator and break when callback is called "false"', function(done) {

    var order = [];
    var collection = {
      a: 5,
      'break': 3.5,
      b: 3,
      c: 2
    };
    async.transformSeries(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, { a: 5 });
      assert.deepEqual(order, [5, 3.5]);
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

    async.transformSeries(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { a: 1, c: 3 });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 4);
      }, value * 10);
    };
    async.transformSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 5, 3, 2, 4]);
      done();
    });

  });

  it('should return response immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries([], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
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
      assert.deepEqual(res, {});
      done();
    });

  });

});

describe('#transformLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1, 1];

    async.transformLimit(collection, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 1, 3, 1]);
      assert.deepEqual(order, [1, 3, 2, 4, 1, 3, 1]);
      done();
    });

  });

  it('should execute iterator in limited by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 4,
      d: 3,
      e: 1
    };
    async.transformLimit(collection, 3, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { a: 1, b: 3, d: 3, e: 1 });
      assert.deepEqual(order, [1, 3, 4, 1, 3]);
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
    async.transformLimit(collection, 4, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, { b: 3 });
      assert.deepEqual(order, [2, 3, 3.5]);
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
      assert.deepEqual(res, { a: 1, c: 3 });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 3);
      }, value * 10);
    };
    async.transformLimit(collection, 3, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
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
      assert.deepEqual(res, {});
      done();
    });

  });

});

