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
    };
    define.amd = true;
    delete(require.cache[path]);
    require(path);
    done();

  });

});

