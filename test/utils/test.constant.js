/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#constant', function() {

  it('should get constant response', function(done) {
    async.constant(1, 2, 3)(function(err, result1, result2, result3) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(result1, 1);
      assert.deepStrictEqual(result2, 2);
      assert.deepStrictEqual(result3, 3);
      done();
    });
  });

  it('should ignore other arguments', function(done) {
    async.constant(1, 2, 3)(4, 5, 6, 7, function(err, result1, result2, result3) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(result1, 1);
      assert.deepStrictEqual(result2, 2);
      assert.deepStrictEqual(result3, 3);
      assert.strictEqual(arguments.length, 4);
      done();
    });
  });
});
