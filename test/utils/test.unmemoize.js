/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#unmemoize', function() {

  it('should execute without memo', function(done) {

    var order = [];
    var fn = function(arg, callback) {
      order.push(arg);
      callback();
    };

    var fn2 = async.memoize(fn);
    fn2 = async.unmemoize(fn2);

    fn2(1, function() {

      fn2(2, function() {

        fn2(1, function() {

          assert.deepStrictEqual(order, [1, 2, 1]);
          done();
        });
      });
    });
  });

});
