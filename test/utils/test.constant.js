/* global it */
'use strict';

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#constant', function() {

  it('should get constant response', function(done) {
    async.constant(1, 2, 3)(function(err, result1, result2, result3) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(result1, 1);
      assert.deepEqual(result2, 2);
      assert.deepEqual(result3, 3);
      done();
    });
  });
});
