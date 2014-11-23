/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function someIterator(order) {

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

describe('#some', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
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
    async.some(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [2, 3]);
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

    async.some(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    }, Math);
  });
});

describe('#someSeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
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
    async.someSeries(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [5]);
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

    async.someSeries(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    }, Math);
  });
});

describe('#someLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [2, 3, 1];

    async.someLimit(collection, 2, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [2, 3]);
      done();
    });

  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 3,
      c: 1,
      d: 3,
      e: 1
    };
    async.someLimit(collection, 3, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
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

    async.someLimit(collection, 2, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    }, Math);

  });

});

