/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var asyncjs = require('async');
var util = require('../util');
var timer = util.createTimer();
var speedTest = util.checkSpeed() ? it : it.skip;

function timeItrator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      order.push(num);
      if (self && self.pow) {
        num = self.pow(num, 2);
      }

      callback(null, num);
    }, num * 2 + (num % 2 === 0 ? 10 : 30));
  };
}

describe('#times', function() {

  it('should execute iterator', function(done) {

    var n = 3;
    var order = [];
    async.times(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [0, 1, 2]);
      assert.deepEqual(order, [0, 2, 1]);
      done();
    });

  });
  it('should execute iterator with binding', function(done) {

    var n = 3;
    var order = [];
    async.times(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [0, 1, 4]);
      assert.deepEqual(order, [0, 2, 1]);
      done();
    }, Math);

  });

  it('should return response immediately', function(done) {

    var n = 0;
    var order = [];
    async.times(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should throw error', function(done) {

    var n = 4;
    var iterator = function(n, next) {
      next(n === 2);
    };
    async.times(n, iterator, function(err) {
      assert.ok(err);
      setTimeout(function() {
        done();
      }, 50);
    });

  });

  speedTest('should execute faster than async.js', function(done) {

    var n = 1000;
    var array = _.times(n, function(n) {
      return n * 2;
    });
    var result = {
      async: {},
      asyncjs: {}
    };

    var iterator = function(num, callback) {
      callback(null, num * 2);
    };

    // asyncjs
    timer.init().start();
    asyncjs.times(n, iterator, function(err, res1) {
      if (err) {
        return done(err);
      }

      result.asyncjs.time = timer.diff();
      timer.init().start();

      // asyncjs
      async.times(n, iterator, function(err, res2) {
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

describe('#timesSeries', function() {

  it('should execute iterator', function(done) {

    var n = 3;
    var order = [];
    async.timesSeries(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [0, 1, 2]);
      assert.deepEqual(order, [0, 1, 2]);
      done();
    });

  });

  it('should execute iterator with binding', function(done) {

    var n = 3;
    var order = [];
    async.timesSeries(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [0, 1, 4]);
      assert.deepEqual(order, [0, 1, 2]);
      done();
    }, Math);

  });

  it('should return response immediately', function(done) {

    var n = 0;
    var order = [];
    async.timesSeries(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should throw error', function(done) {

    var n = 4;
    var iterator = function(n, next) {
      next(n === 2);
    };
    async.timesSeries(n, iterator, function(err) {
      assert.ok(err);
      done();
    });

  });

});

describe('#timesLimit', function() {

  it('should execute iterator', function(done) {

    var n = 5;
    var order = [];
    async.timesLimit(n, 3, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [0, 1, 2, 3, 4]);
      assert.deepEqual(order, [0, 2, 1, 4, 3]);
      done();
    });

  });

  it('should execute iterator with binding', function(done) {

    var n = 7;
    var order = [];
    async.timesLimit(n, 3, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [0, 1, 4, 9, 16, 25, 36]);
      assert.deepEqual(order, [0, 2, 1, 4, 3, 5, 6]);
      done();
    }, Math);

  });

  it('should return response immediately', function(done) {

    var n = 0;
    var order = [];
    async.timesLimit(n, 2, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should throw error', function(done) {

    var n = 6;
    var iterator = function(n, next) {
      next(n === 4);
    };
    async.timesLimit(n, 3, iterator, function(err) {
      assert.ok(err);
      setTimeout(function() {
        done();
      }, 50);
    });

  });

});

