/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');
var delay = require('../config').delay;

function rejectIterator(order) {

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

describe('#reject', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reject(collection, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [2, 4]);
      assert.deepEqual(order, [1, 2, 3, 4]);
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
    async.reject(collection, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [4, 2]);
      assert.deepEqual(order, [2, 3, 4]);
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

    async.reject(collection, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [3.5]);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);
  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 2, 3];
    var iterator = function(num, callback) {
      callback();
      callback();
    };
    try {
      async.reject(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.reject(array, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.reject(object, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.reject(function() {}, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.reject(undefined, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.reject(null, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });
});

describe('#rejectSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.rejectSeries(collection, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [2, 4]);
      assert.deepEqual(order, [1, 3, 2, 4]);
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
    async.rejectSeries(collection, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [4, 2]);
      assert.deepEqual(order, [4, 3, 2]);
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

    async.rejectSeries(collection, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [3.5]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);
  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 2, 3];
    var iterator = function(num, callback) {
      callback();
      callback();
    };
    try {
      async.rejectSeries(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.rejectSeries(array, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.rejectSeries(object, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.rejectSeries(function() {}, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.rejectSeries(undefined, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.rejectSeries(null, rejectIterator(order), function(res) {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });
});

describe('#rejectLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.rejectLimit(collection, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, [2, 4]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
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
    async.rejectLimit(collection, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, [2, 4]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
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

    async.rejectLimit(collection, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, [3.5]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.rejectLimit(collection, Infinity, rejectIterator(order), function(res) {
      assert.deepEqual(res, [4, 2]);
      assert.deepEqual(order, [1, 1, 2, 3, 3, 4]);
      done();
    });

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.rejectLimit(array, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.rejectLimit(object, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.rejectLimit(function() {}, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.rejectLimit(undefined, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.rejectLimit(collection, 0, rejectIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.rejectLimit(collection, undefined, rejectIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 2, 3];
    var iterator = function(num, callback) {
      callback();
      callback();
    };
    try {
      async.rejectLimit(collection, 2, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

});
