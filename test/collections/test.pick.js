/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function pickIterator(order) {

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

describe('#pick', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pick(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, [1, 3]);
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
    async.pick(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, { b: 3 });
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

    async.pick(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, { a: 1.1, c: 2.6 });
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });
});

describe('#pickSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pickSeries(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, [1, 3]);
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
    async.pickSeries(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, { b: 3 });
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

    async.pickSeries(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, { a: 1.1, c: 2.6 });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });
});

describe('#pickLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.pickLimit(collection, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, [1, 3, 3, 1]);
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
    async.pickLimit(collection, 3, pickIterator(order), function(res) {
      assert.deepEqual(res, { a: 1, b: 3, d: 3, e: 1 });
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

    async.pickLimit(collection, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, { a: 1.1, c: 2.7 });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

});

