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

    }, num * 10);
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
    } catch(e) {
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
    } catch(e) {
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

});

describe('#eachLimit', function() {

  it('should execute iterator in ned by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3];

    async.eachLimit(collection, 2, eachIterator(order), function(err) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(order, [1, 3, 2, 4, 3]);
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

  it('should throw error', function(done) {

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
});

