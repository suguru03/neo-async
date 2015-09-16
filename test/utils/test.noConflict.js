/* global it */
'use strict';

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#noConflict', function() {

  it('should check no conflict', function(done) {

    var _async = async.noConflict();
    assert.strictEqual(async, _async);
    done();
  });
});
