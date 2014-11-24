/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var asyncjs = require('async');
var timer = require('../util').createTimer();

function eachIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }

      order.push(num);
      callback();

    }, num * 10);
  };
}

describe('#each', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.each(collection, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
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
    async.each(collection, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
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

    async.each(collection, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);

  });

  it('should execute faster than async.js', function(done) {

    var sample = 1000;
    var collection = _.sample(_.times(sample), sample);
    var sum = _.reduce(collection, function(sum, num) {
        return sum + num;
      }, 0);

    var result = {
      async: {},
      asyncjs: {}
    };

    var iterator = function(result) {

      result.sum = 0;

      return function(num, callback) {

        result.sum += num;
        callback();
      };
    };

    // asyncjs
    timer.init().start();
    asyncjs.each(collection, iterator(result.asyncjs), function(err) {
      if (err) {
        return done(err);
      }

      result.asyncjs.time = timer.diff();
      timer.init().start();

      // async
      async.each(collection, iterator(result.async), function(err) {
        if (err) {
          return done(err);
        }

        result.async.time = timer.diff();

        // order
        assert.strictEqual(result.async.sum, sum);
        assert.strictEqual(result.asyncjs.sum, sum);
        assert.ok(result.async.time < result.asyncjs.time);

        done();
      });
    });

  });

  it('should cause error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3);
      }, num * 10);
    };

    async.each(collection, iterator, function(err) {
      assert.ok(err);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

  it('should break if respond equals false', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(null, num !== 3);
      }, num * 10);
    };

    async.each(collection, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

});

describe('#eachSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];

    async.eachSeries(collection, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }

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
    async.eachSeries(collection, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
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

    async.eachSeries(collection, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
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
        callback(num === 3);
      }, num * 10);
    };

    async.eachSeries(collection, iterator, function(err) {
      assert.ok(err);
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

  it('should break if respond equals false', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(null, num !== 3);
      }, num * 10);
    };

    async.eachSeries(collection, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

});

describe('#eachLimit', function() {

  it('should execute iterator in ned by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];

    async.eachLimit(collection, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }

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
    async.eachLimit(collection, 3, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
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

    async.eachLimit(collection, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
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
        callback(num === 3);
      }, num * 10);
    };

    async.eachLimit(collection, 3, iterator, function(err) {
      assert.ok(err);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

  it('should break if respond equals false', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(null, num !== 3);
      }, num * 10);
    };

    async.eachLimit(collection, 3, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

});

