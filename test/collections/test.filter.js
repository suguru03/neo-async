/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function filterIterator(order) {

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

describe('#filter', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filter(collection, filterIterator(order), function(res) {
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
    async.filter(collection, filterIterator(order), function(res) {
      assert.deepEqual(res, [3]);
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

    async.filter(collection, filterIterator(order), function(res) {
      assert.deepEqual(res, [1.1, 2.6]);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filter([], filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filter(function() {}, filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filter(undefined, filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

});

describe('#filterSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.filterSeries(collection, filterIterator(order), function(res) {
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
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
    async.filterSeries(collection, filterIterator(order), function(res) {
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2]);
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

    async.filterSeries(collection, filterIterator(order), function(res) {
      assert.deepEqual(res, [1.1, 2.6]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filterSeries([], filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filterSeries(function() {}, filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filterSeries(undefined, filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

});

describe('#filterLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.filterLimit(collection, 2, filterIterator(order), function(res) {
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
    async.filterLimit(collection, 3, filterIterator(order), function(res) {
      assert.deepEqual(res, [1, 3, 1, 3]);
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

    async.filterLimit(collection, 2, filterIterator(order), function(res) {
      assert.deepEqual(res, [1.1, 2.7]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.filterLimit([], 2, filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.filterLimit(function() {}, 2, filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.filterLimit(undefined, 2, filterIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });


});

