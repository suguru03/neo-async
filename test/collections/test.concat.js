/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var asyncjs = require('async');
var util = require('../util');
var timer = util.createTimer();
var speedTest = util.checkSpeed() ? it : it.skip;

function concatIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {


      if (self && self.round) {
        num = self.round(num);
      }

      order.push(num);
      var array = [];

      while(num > 0) {
        array.push(num--);
      }

      callback(null, array);
    }, num * 10);
  };
}

describe('#concat', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concat(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
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
    async.concat(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
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

    async.concat(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });

  speedTest('should execute faster than async.js', function(done) {

    var sample = 500;
    var collection = _.sample(_.times(sample), sample);
    var array = [];
    _.forEach(collection, function(num) {
      Array.prototype.push.apply(array, _.times(num));
    });

    var result = {
      async: {},
      asyncjs: {}
    };

    var iterator = function(num, callback) {
      callback(null, _.times(num));
    };

    // async
    timer.init().start();
    asyncjs.concat(collection, iterator, function(err, res1) {
      if (err) {
        return done(err);
      }

      result.asyncjs.time = timer.diff();
      timer.init().start();

      // asyncjs
      async.concat(collection, iterator, function(err, res2) {
        if (err) {
          return done(err);
        }

        result.async.time = timer.diff();

        // result
        assert.ok(result.async.time < result.asyncjs.time);
        assert.deepEqual(res1, array);
        assert.deepEqual(res2, array);

        done();
      });
    });

  });

});

describe('#concatSeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatSeries(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concatSeries(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
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

    async.concatSeries(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 4, 3, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

});

describe('#concatLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concatLimit(collection, 3, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
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

    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 4, 3, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

});

