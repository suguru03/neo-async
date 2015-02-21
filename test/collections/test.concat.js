/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function concatIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }

      order.push(num);
      var array = [];

      while (num > 0) {
        array.push(num--);
      }

      callback(null, array);
    }, num * 30);
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

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };
    async.concat(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = {};
    async.concat(array, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = [];
    async.concat(object, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.concat(function() {}, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.concat(undefined, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.concat(null, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
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

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 10);
    };
    async.concatSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      callback();
      callback();
    };
    try {
      async.concatSeries(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = {};
    async.concatSeries(array, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = [];
    async.concatSeries(object, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.concatSeries(function() {}, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.concatSeries(undefined, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.concatSeries(null, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

});

describe('#concatLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];
    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });

  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });

  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.5
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

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatLimit(collection, Infinity, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4, 5];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 30);
    };
    async.concatLimit(collection, 5, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = {};
    async.concatLimit(array, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = [];
    async.concatLimit(object, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.concatLimit(function() {}, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.concatLimit(undefined, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.concatLimit(null, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatLimit(collection, 0, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatLimit(collection, undefined, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

});
