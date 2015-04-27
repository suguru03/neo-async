/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = global.async || require('../../../').safe;
var safeAsync = async === async.noConflict() ? async.safe : async;

describe('#safe', function() {

  describe('#eachSeries', function() {

    it('should execute sync iterator many times', function(done) {

      var called = 0;
      var sum = 0;
      var times = 100000;
      var array = _.times(times);
      var syncIterator = function(num, done) {
        sum += num;
        called++;
        done();
      };
      safeAsync.eachSeries(array, syncIterator, function(err) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(called, times);
        assert.strictEqual(sum, _.sum(array));
        done();
      });
    });
  });

});
