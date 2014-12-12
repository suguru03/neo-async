/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function sortByIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }

      order.push(num);
      callback(null, num * 2);
    }, num * 10);
  };
}

describe('#sortBy', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
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
    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
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

    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1.1, 2.7, 3.5]);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };
    async.sortBy(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

});

describe('#sortBySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 3, 2]);
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
    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 3, 2]);
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

    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1.1, 2.7, 3.5]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };
    async.sortBySeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

});

describe('#sortByLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortByLimit(collection, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 3, 2]);
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
    async.sortByLimit(collection, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 3, 2]);
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

    async.sortByLimit(collection, 5, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1.1, 2.7, 3.5]);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };
    async.sortByLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

});

