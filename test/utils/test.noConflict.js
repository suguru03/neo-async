/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#noConflict', function() {

  it('should check no conflict', function(done) {

    var _async = async.noConflict();
    assert.strictEqual(async, _async);
    done();
  });
});
