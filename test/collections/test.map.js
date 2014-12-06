/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function mapIterator(order) {

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

describe('#map', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
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
    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
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

    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 8, 6]);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });

  it('should cause error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };

    async.map(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

});

describe('#mapSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, [2, 6, 4]);
      assert.deepEqual(order, [1, 3, 2]);
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
    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 4]);
      assert.deepEqual(order, [1, 3, 2]);
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

    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 8, 6]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should cause error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };

    async.mapSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

});

describe('#mapLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.mapLimit(collection, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 8, 4, 6, 2]);
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
    async.mapLimit(collection, 3, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 6, 8, 6, 2]);
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

    async.mapLimit(collection, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 8, 6]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should cause error', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };

    async.mapLimit(collection, 4, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });


});

