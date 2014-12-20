/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function rejectIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }

      order.push(num);
      callback(num % 2);
    }, num * 10);
  };
}

describe('#reject', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reject(collection, rejectIterator(order), function(res) {
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
      assert.deepEqual(res, { c: 2, a: 4 });
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
      assert.deepEqual(res, { b: 3.5 });
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 2, 3] ;
    var iterator = function(num, callback) {
      callback();
      callback();
    };
    try {
      async.reject(collection, iterator);
    } catch(e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

});

describe('#rejectSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.rejectSeries(collection, rejectIterator(order), function(res) {
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
      assert.deepEqual(res, { a: 4, c: 2 });
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
      assert.deepEqual(res, { b: 3.5 });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 2, 3] ;
    var iterator = function(num, callback) {
      callback();
      callback();
    };
    try {
      async.rejectSeries(collection, iterator);
    } catch(e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

});

describe('#rejectLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.rejectLimit(collection, 2, rejectIterator(order), function(res) {
      assert.deepEqual(res, [4, 2]);
      assert.deepEqual(order, [1, 3, 2, 4, 1, 3]);
      done();
    });

  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 4,
      d: 3,
      e: 1
    };
    async.rejectLimit(collection, 3, rejectIterator(order), function(res) {
      assert.deepEqual(res, { c: 4 });
      assert.deepEqual(order, [1, 3, 4, 1, 3]);
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
      assert.deepEqual(res, { b: 3.5 });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 2, 3] ;
    var iterator = function(num, callback) {
      callback();
      callback();
    };
    try {
      async.rejectLimit(collection, 2, iterator);
    } catch(e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }
  });

});

