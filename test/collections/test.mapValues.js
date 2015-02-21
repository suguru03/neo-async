/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

function mapValuesIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }

      order.push(num);
      callback(null, num * 2);
    }, num * 30);
  };
}

describe('#mapValues', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValues(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 4
      });
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
    async.mapValues(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 6,
        c: 4
      });
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

    async.mapValues(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 8,
        c: 6
      });
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

    async.mapValues(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, {
        '0': 1,
        '1': 3,
        '2': 2
      });
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 3];
    var iterator = function(num, callback) {
      callback(null, num);
      callback(null, num);
    };
    try {
      async.mapValues(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapValues(array, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapValues(object, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapValues(function() {}, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.mapValues(undefined, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.mapValues(null, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

});

describe('#mapValuesSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValuesSeries(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 4
      });
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
    async.mapValuesSeries(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 6,
        c: 4
      });
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

    async.mapValuesSeries(collection, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 8,
        c: 6
      });
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

    async.mapValuesSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, {
        '0': 1,
        '1': 3
      });
      assert.deepEqual(order, [1, 3]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 3];
    var iterator = function(num, callback) {
      callback(null, num);
      callback(null, num);
    };
    try {
      async.mapValuesSeries(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapValuesSeries(array, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapValuesSeries(object, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapValuesSeries(function() {}, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.mapValuesSeries(undefined, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.mapValuesSeries(null, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

});

describe('#mapValuesLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.mapValuesLimit(collection, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 10,
        '2': 6,
        '3': 8,
        '4': 4
      });
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
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
    async.mapValuesLimit(collection, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 10,
        c: 6,
        d: 8,
        e: 4
      });
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
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

    async.mapValuesLimit(collection, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        a: 2,
        b: 8,
        c: 6
      });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3];

    async.mapValuesLimit(collection, Infinity, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {
        '0': 2,
        '1': 6,
        '2': 8,
        '3': 4,
        '4': 6
      });
      assert.deepEqual(order, [1, 2, 3, 3, 4]);
      done();
    });

  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * 30);
    };

    async.mapValuesLimit(collection, 4, iterator, function(err, res) {
      assert.ok(err);
      assert.deepEqual(res, {
        '0': 1,
        '1': 3,
        '3': 2
      });
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      callback(null, num);
      callback(null, num);
    };
    try {
      async.mapValuesLimit(collection, 2, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.mapValuesLimit(array, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.mapValuesLimit(object, 2, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.mapValuesLimit(function() {}, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.mapValuesLimit(undefined, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.mapValuesLimit(null, 3, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValuesLimit(collection, 0, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.mapValuesLimit(collection, undefined, mapValuesIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

});
