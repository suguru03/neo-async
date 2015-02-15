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

    assert.strictEqual(
      async.apply(function(name) {
        return 'hello ' + name;
      }, 'world')(),
      'hello world'
    );
    done();

  });

  it('should apply other object', function(done) {

    var func = function(num1, num2, callback) {
      assert.strictEqual(this, Math);
      setTimeout(function(math) {
        callback(null, math.round(num1 + num2));
      }, num1 * 10, this);
    };
    async.parallel([
      async.apply(func, 1).bind(Math, 1.1),
      async.apply(func, 2).bind(Math, 1.3),
      async.apply(func, 3).bind(Math, 1.5),
      async.apply(func, 4).bind(Math, 1.7)
    ], function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, [2, 3, 5, 6]);
      done();
    });
  });

});

