/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var asyncjs = require('async');
var timer = require('../util').createTimer();

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

  it('should execute faster than async.js', function(done) {

    var sample = 1000;
    var collection = _.sample(_.times(sample), sample);
    var array = [];
    var sum = _.reduce(collection, function(sum, num) {
        array.push(num * 2);
        return sum + num;
      }, 0);

    var result = {
      async: {
        sum: 0
      },
      asyncjs: {
        sum: 0
      }
    };

    var iterator = function(result) {

      return function(num, callback) {

        result.sum += num;
        callback(null, num * 2);
      };
    };

    // asyncjs
    timer.init().start();
    asyncjs.map(collection, iterator(result.asyncjs), function(err, res1) {
      if (err) {
        return done(err);
      }

      result.asyncjs.time = timer.diff();
      timer.init().start();

      // async
      async.map(collection, iterator(result.async), function(err, res2) {
        if (err) {
          return done(err);
        }

        result.async.time = timer.diff();

        // result
        assert.ok(result.async.sum, sum);
        assert.ok(result.asyncjs.sum, sum);
        assert.ok(result.async.time < result.asyncjs.time);
        var sample = _.sample(collection);
        assert.ok(res1[sample], res2[sample]);
        //assert.deepEqual(res1, array);
        //assert.deepEqual(res2, array);

        done();
      });
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

});

