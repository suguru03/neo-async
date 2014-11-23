/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');

function reduceIterator(order) {

  return function(memo, num, callback) {

    var self = this;

    setTimeout(function() {


      if (self && self.round) {
        num = self.round(num);
      }

      if (_.isArray(memo)) {
        memo.push(num);
      } else if (_.isNumber(memo)){
        memo += num;
      } else {
        memo[num] = num;
      }

      order.push(num);
      callback(null, memo);
    }, num * 10);
  };
}

describe('#reduce', function() {

  it('should sum number by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduce(collection, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.equal(res, 10);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });

  });

  it('should get array by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduce(collection, [], reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 2, 4]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });

  });

  it('should get object  by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.reduce(collection, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { 2: 2, 3: 3, 5: 5 });
      assert.deepEqual(order, [5, 3, 2]);
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

    async.reduce(collection, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { 1: 1, 3: 3, 4: 4 });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });
});

describe('#reduceRight', function() {

  it('should sum number by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduceRight(collection, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.equal(res, 10);
      assert.deepEqual(order, [4, 2, 3, 1]);
      done();
    });

  });

  it('should get array by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduceRight(collection, [], reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [4, 2, 3, 1]);
      assert.deepEqual(order, [4, 2, 3, 1]);
      done();
    });

  });

  it('should get object  by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.reduceRight(collection, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, { 2: 2, 3: 3, 5: 5 });
      assert.deepEqual(order, [2, 3, 5]);
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

    async.reduceRight(collection, [], reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [3, 4, 1]);
      assert.deepEqual(order, [3, 4, 1]);
      done();
    }, Math);

  });

});

