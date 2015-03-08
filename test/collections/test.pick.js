/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#pick', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pick(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pick(collection, pickIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pick(collection, pickIteratorWithKey(order), function(res) {
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2],
        [3, 1],
        [4, 3]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pick(collection, pickIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 0],
        [2, 2],
        [3, 1],
        [4, 3]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.pick(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, {
        b: 3
      });
      assert.deepEqual(order, [2, 3, 4]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.pick(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, {
        a: 1.1,
        c: 2.6
      });
      assert.deepEqual(order, [1, 3, 4]);
      done();
    }, Math);
  });

  it('should throw error if double callback', function(done) {

    var collection = [2, 1, 3];
    var iterator = function(item, callback) {
      callback();
      callback();
    };
    try {
      async.pick(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.pick(array, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.pick(object, pickIterator(order), function(res) {
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.pick(function() {}, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.pick(undefined, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.pick(null, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#pickSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pickSeries(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pickSeries(collection, pickIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.pickSeries(collection, pickIteratorWithKey(order), function(res) {
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2],
        [4, 3]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.pickSeries(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, {
        b: 3
      });
      assert.deepEqual(order, [4, 3, 2]);
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

    async.pickSeries(collection, pickIterator(order), function(res) {
      assert.deepEqual(res, {
        a: 1.1,
        c: 2.6
      });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should throw error if double callback', function(done) {

    var collection = [2, 1, 3];
    var iterator = function(item, callback) {
      callback();
      callback();
    };
    try {
      async.pickSeries(collection, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.pickSeries(array, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.pickSeries(object, pickIterator(order), function(res) {
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.pickSeries(function() {}, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.pickSeries(undefined, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.pickSeries(null, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

});

describe('#pickLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.pickLimit(collection, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, [1, 5, 3]);
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
      d: 2,
      e: 4
    };
    async.pickLimit(collection, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, {
        a: 1,
        b: 5,
        c: 3
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

    async.pickLimit(collection, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, {
        a: 1.1,
        c: 2.7
      });
      assert.deepEqual(order, [1, 4, 3]);
      done();
    }, Math);

  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1, 3];

    async.pickLimit(collection, Infinity, pickIterator(order), function(res) {
      assert.deepEqual(res, [1, 3, 3, 1, 3]);
      assert.deepEqual(order, [1, 1, 2, 3, 3, 3, 4]);
      done();
    });

  });

  it('should throw error if double callback', function(done) {

    var collection = [2, 1, 3];
    var iterator = function(item, callback) {
      callback();
      callback();
    };
    try {
      async.pickLimit(collection, 4, iterator);
    } catch (e) {
      assert.strictEqual(e.message, 'Callback was already called.');
      done();
    }

  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.pickLimit(array, 3, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.pickLimit(object, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.pickLimit(function() {}, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.pickLimit(undefined, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.pickLimit(null, 2, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.pickLimit(collection, 0, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.pickLimit(collection, undefined, pickIterator(order), function(res) {
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });

  });

});

function pickIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(num % 2);
    }, num * 30);
  };
}

function pickIteratorWithError(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(null, num % 2);
    }, num * 30);
  };
}

function pickIteratorWithKey(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(num % 2);
    }, num * 30);
  };
}

function pickIteratorWithKeyAndError(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(null, num % 2);
    }, num * 30);
  };
}
