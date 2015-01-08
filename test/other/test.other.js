/* global describe, it */

define = function() {
};

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');
var path = require('path').resolve('./lib/async.js');

describe('#define', function() {

  'use strict';

  it('should check define', function(done) {

    define = function(array, callback) {
      assert.deepEqual(array, []);
      var _async = callback();
      assert.deepEqual(_.keys(async), _.keys(_async));
      done();
    };
    define.amd = true;
    delete(require.cache[path]);
    require(path);
    define = null;
  });

});

describe('#nextTick', function() {

  'use strict';

  it('should check nextTick if process does not have nextTick', function(done) {

    var _nextTick = process.nextTick;
    process.nextTick = undefined;
    delete(require.cache[path]);
    require(path);
    process.nextTick = _nextTick;
    done();
  });

  it('should check nextTick if process does not have nextTick and setImmediate', function(done) {

    var _nextTick = process.nextTick;
    var _setImmediate = setImmediate;
    process.nextTick = undefined;
    setImmediate = undefined;
    delete(require.cache[path]);
    require(path);
    process.nextTick = _nextTick;
    setImmediate = _setImmediate;
    done();
  });

  it('should check nextTick if does not have setImmediate', function(done) {

    var _setImmediate = setImmediate;
    setImmediate = undefined;
    delete(require.cache[path]);
    require(path);
    setImmediate = _setImmediate;
    done();
  });

});
