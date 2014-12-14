/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function everyIterator(order) {

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

describe('#every', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });

  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 1, 3, 5]);
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
    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [2]);
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

    async.every(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });
});

describe('#everySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });

  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 3, 1, 5]);
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
    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [4]);
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

    async.everySeries(collection, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 4]);
      done();
    }, Math);

  });
});

describe('#everyLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everyLimit(collection, 3, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 2]);
      done();
    });

  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.everyLimit(collection, 1, everyIterator(order), function(res) {
      assert.strictEqual(res, true);
      assert.deepEqual(order, [1, 3, 1, 5]);
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
    async.everyLimit(collection, 2, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [3, 4]);
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

    async.everyLimit(collection, 2, everyIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, [1, 4]);
      done();
    }, Math);

  });

});

