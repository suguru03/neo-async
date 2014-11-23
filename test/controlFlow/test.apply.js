/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#apply', function() {

  it('should apply arguments', function(done) {

    var func = function() {
      assert.deepEqual(Array.prototype.slice.call(arguments), [1, 2, 3, 4]);
    };

    async.apply(func, 1, 2, 3, 4)();
    async.apply(func, 1, 2, 3)(4);
    async.apply(func, 1, 2)(3, 4);
    async.apply(func, 1)(2, 3, 4);

    var fn = async.apply(func);
    fn(1, 2, 3, 4);
    fn(1, 2, 3, 4);

    done();

  });

});

