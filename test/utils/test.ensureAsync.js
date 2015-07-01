/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#ensureAsync', function() {

  it('should call function on asynchronous', function(done) {

    var sync = true;
    var func = function(callback) {
      callback();
    };
    async.ensureAsync(func)(function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });

  it('should call asynchronous function', function(done) {

    var sync = true;
    var func = function(callback) {
      setImmediate(callback);
    };
    async.ensureAsync(func)(function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });
});
