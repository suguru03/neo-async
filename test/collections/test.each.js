/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function eachIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {
      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback();
    }, num * 30);
  };
}

function eachIteratorWithKey(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {
      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback();
    }, num * 30);
  };
}

function eachIteratorWithKey(order) {

  return function(num, key, callback) {

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

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.each(collection, eachIteratorWithKey(order), function(err) {
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

  it('should throw error', function(done) {

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

  it('should throw error if double callback', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      callback();
      callback();
    };

    try {
      async.each(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should throw error to callback if callback was called twice and caused error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      callback();
      callback('error');
    };

    async.each(collection, iterator, function(err) {
      assert.ok(err);
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

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.each(array, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.each(object, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.each(function() {}, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.each(undefined, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.each(null, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
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

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];

    async.eachSeries(collection, eachIteratorWithKey(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2]
      ]);
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

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.eachSeries(collection, eachIteratorWithKey(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
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

  it('should throw error', function(done) {

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

  it('should throw error if double callback', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      callback();
      callback();
    };

    try {
      async.eachSeries(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }
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

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.eachSeries(array, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.eachSeries(object, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.eachSeries(function() {}, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.eachSeries(undefined, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.eachSeries(null, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#eachLimit', function() {

  it('should execute iterator in ned by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.eachLimit(collection, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in ned by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.eachLimit(collection, 2, eachIteratorWithKey(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [
        [1, 0],
        [3, 2],
        [5, 1],
        [2, 4],
        [4, 3]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    async.eachLimit(collection, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    async.eachLimit(collection, 2, eachIteratorWithKey(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'e'],
        [4, 'd']
      ]);
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

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3];

    async.eachLimit(collection, Infinity, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(order, [1, 2, 3, 3, 4]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3);
      }, num * 30);
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

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.eachLimit(array, 3, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.eachLimit(object, 3, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.eachLimit(function() {}, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.eachLimit(undefined, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.eachLimit(null, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.eachLimit(collection, 0, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.eachLimit(collection, undefined, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, []);
      done();
    });
  });

});
