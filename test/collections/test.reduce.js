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
      assert.strictEqual(res, 10);
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

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(memo, num, callback) {
      setTimeout(function() {
        memo.push(num);
        order.push(num);
        callback(num === 3, memo);
      }, num * 10);
    };
    async.reduce(collection, [], iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(memo, num, callback) {
      callback();
      callback();
    };
    try {
      async.reduce(collection, [], iterator);
    } catch(e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.reduce(array, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.reduce(object, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepEqual(order, []);
      done();
    });

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
      assert.strictEqual(res, 10);
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

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(memo, num, callback) {
      setTimeout(function() {
        memo.push(num);
        order.push(num);
        callback(num === 3, memo);
      }, num * 10);
    };
    async.reduceRight(collection, [], iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepEqual(order, [4, 2, 3]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(memo, num, callback) {
      callback();
      callback();
    };
    try {
      async.reduceRight(collection, [], iterator);
    } catch(e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.reduceRight(array, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.reduceRight(object, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepEqual(order, []);
      done();
    });

  });

});

