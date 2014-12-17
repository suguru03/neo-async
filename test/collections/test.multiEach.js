/* global describe, it */
'use strict';

var assert = require('power-assert');
var _ = require('lodash');
var async = require('../../');

describe('#multiEach', function() {

  it('should execute multi-each function', function(done) {

    var order = [];
    var collection = [
      [
        [4, 7, 1],
        [5, 8, 2],
        [6, 9, 3]
      ], [
        [4, 7, 1],
        [5, 8, 2],
        [6, 9, 3]
      ]
    ];
    var tasks = [
      function(array, index, callback) {
        order.push(array.toString());
        callback(null, array);
      },
      function(array, index, callback) {
        order.push(array.toString());
        callback(null, array);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, num);
      }
    ];

    // get same result
    var _order = [];
    _.forEach(collection, function(array1) {
      _order.push(array1.toString());
      _.forEach(array1, function(array2) {
        _order.push(array2.toString());
        _.forEach(array2, function(num) {
          _order.push(num);
        });
      });
    });

    async.multiEach(collection, tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, _order);
      assert.deepEqual(order, [
        '4,7,1,5,8,2,6,9,3',
        '4,7,1',
        4,
        7,
        1,
        '5,8,2',
        5,
        8,
        2,
        '6,9,3',
        6,
        9,
        3,
        '4,7,1,5,8,2,6,9,3',
        '4,7,1',
        4,
        7,
        1,
        '5,8,2',
        5,
        8,
        2,
        '6,9,3',
        6,
        9,
        3
      ]);
      assert.strictEqual(collection, res);
      assert.deepEqual(collection, [
        [
          [4, 7, 1],
          [5, 8, 2],
          [6, 9, 3]
        ], [
          [4, 7, 1],
          [5, 8, 2],
          [6, 9, 3]
        ]
      ]);
      done();
    });

  });

  it('should execute multi-each to same collection', function(done) {

    var order = [];
    var collection = [1, 2, 3];
    var tasks = [
      function(num, index, callback) {
        order.push(num);
        callback(null, collection);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, collection);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, collection);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, collection);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, collection);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, collection);
      }
    ];

    // get same result
    var _order = [];
    _.forEach(collection, function(num) {
      _order.push(num);
      _.forEach(collection, function(num) {
        _order.push(num);
        _.forEach(collection, function(num) {
          _order.push(num);
          _.forEach(collection, function(num) {
            _order.push(num);
            _.forEach(collection, function(num) {
              _order.push(num);
              _.forEach(collection, function(num) {
                _order.push(num);
              });
            });
          });
        });
      });
    });

    async.multiEach(collection, tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, _order);
      done();
    });

  });

  it('should execute multi-each in asynchronous', function(done) {

    var order = [];
    var collection = [
      [
        [4, 7, 1],
        [5, 8, 2],
        [6, 9, 3]
      ], [
        [4, 7, 1],
        [5, 8, 2],
        [6, 9, 3]
      ]
    ];
    var tasks = [
      function(array, index, callback) {
        setTimeout(function() {
          callback(null, array);
        }, index * 100);
      },
      function(array, index, callback) {
        setImmediate(function() {
          callback(null, array);
        });
      },
      function(num, index, callback) {
        setTimeout(function() {
          order.push(num);
          callback(null, num);
        }, num * 10);
      }
    ];
    async.multiEach(collection, tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9
      ]);
      done();
    });
  });

  it('should execute multi-each to mixed collection', function(done) {

    var order = [];
    var array = [3, 5, 1];
    var object = {
      a: 2,
      b: 6,
      c: 4
    };
    var tasks = {
      task1: function(num, key, callback) {
        order.push(num);
        callback(null, object);
      },
      task2: function(num, key, callback) {
        order.push(num);
        callback(null, array);
      },
      task3: function(num, index, callback) {
        order.push(num);
        callback(null, array);
      },
      task4: function(num, index, callback) {
        order.push(num);
        callback();
      }
    };

    // get same result
    var _order = [];
    _.forEach(object, function(num) {
      _order.push(num);
      _.forEach(object, function(num) {
        _order.push(num);
        _.forEach(array, function(num) {
          _order.push(num);
          _.forEach(array, function(num) {
            _order.push(num);
          });
        });
      });
    });

    async.multiEach(object, tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, _order);
      done();
    });

  });

  it('should test for README-1', function(done) {

    var order = [];
    var array = [1, 2, 3];
    var tasks = [
      function(num, index, callback) {
        order.push(num);
        callback(null, array);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, array);
      },
      function(num, index, callback) {
        order.push(num);
        callback(null, array);
      },
      function(num, index, callback) {
        order.push(num);
        callback();
      }
    ];

    // get same result
    var _order = [];
    array.forEach(function(num) {
      _order.push(num);
      array.forEach(function(num) {
        _order.push(num);
        array.forEach(function(num) {
          _order.push(num);
          array.forEach(function(num) {
            _order.push(num);
          });
        });
      });
    });

    async.multiEach(array, tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, _order);
      done();
    });

  });

  it('should test for README-2', function(done) {

    var order = [];
    var array = [1, 2, 3];
    var collection = {
      a: [array, array],
      b: {
        c: array,
        d: array
      }
    };
    var delay = [25, 10];
    var tasks = [
      function(collection, key, callback) {
        setTimeout(function() {
          callback(null, array);
        }, delay.shift());
      },
      function(collection, key, callback) {
        callback(null, array);
      },
      function(value, key, callback) {
        setTimeout(function() {
          order.push(value);
          callback();
        }, value * 10);
      }
    ];

    async.multiEach(collection, tasks, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(order, [
        1, 1, 1,
        2, 2, 2,
        1, 1, 1,
        3, 3, 3,
        2, 2, 2,
        3, 3, 3
      ]);
      done();
    });

  });

});
