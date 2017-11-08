/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#reflect', function() {

  it('should execute with error in parallel', function(done) {

    var tasks = [
      async.reflect(function(callback) {
        callback('error', 1);
      }),
      async.reflect(function(callback) {
        callback('error2', 2);
      }),
      async.reflect(function(callback) {
        callback(null, 3);
      })
    ];
    async.parallel(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [
        { error: 'error' },
        { error: 'error2' },
        { value: 3 }
      ]);
      done();
    });
  });

  it('should execute with error in series', function(done) {

    var tasks = [
      async.reflect(function(callback) {
        callback('error', 1);
      }),
      async.reflect(function(callback) {
        callback('error2', 2);
      }),
      async.reflect(function(callback) {
        callback(null, 3, 3);
      })
    ];
    async.series(tasks, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [
        { error: 'error' },
        { error: 'error2' },
        { value: [3, 3] }
      ]);
      done();
    });
  });

  it('should execute even if it has an argument', function(done) {

    var reflect = async.reflect(function(arg, callback) {
      callback('error', arg);
    });
    reflect(1, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        error: 'error'
      });
      done();
    });
  });

  it('should execute even if it has two arguments', function(done) {

    var reflect = async.reflect(function(arg1, arg2, callback) {
      callback(null, arg1, arg2);
    });
    reflect(1, 2, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        value: [1, 2]
      });
      done();
    });
  });

  it('should execute even if it has some arguments', function(done) {

    var reflect = async.reflect(function(arg1, arg2, arg3, arg4, callback) {
      callback(null, arg3, arg4, arg1);
    });
    reflect(1, 2, 3, 4, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        value: [3, 4, 1]
      });
      done();
    });
  });
});

parallel('#reflectAll', function() {

  it('should execute array tasks', function(done) {
    var tasks = [
      function(done) {
        done('error', 1);
      },
      function(done) {
        done('error2', 2);
      },
      function(done) {
        done(null, 3);
      }
    ];
    async.parallel(async.reflectAll(tasks), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [
        { error: 'error' },
        { error: 'error2' },
        { value: 3 }
      ]);
      done();
    });
  });

  it('should execute object tasks', function(done) {
    var tasks = {
      a: function(done) {
        done('error', 1);
      },
      b: function(done) {
        done('error2', 2);
      },
      c: function(done) {
        done(null, 3, 4, 5);
      }
    };
    async.parallel(async.reflectAll(tasks), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        a: { error: 'error' },
        b: { error: 'error2' },
        c: { value: [3, 4, 5] }
      });
      done();
    });
  });
});
