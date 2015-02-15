/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#alias', function() {

  it('should have alias of forEach', function(done) {

    assert.strictEqual(async.forEach, async.each);
    done();
  });

  it('should have alias of forEachSeries', function(done) {

    assert.strictEqual(async.forEachSeries, async.eachSeries);
    done();
  });

  it('should have alias of forEachLimit', function(done) {

    assert.strictEqual(async.forEachLimit, async.eachLimit);
    done();
  });

  it('should have alias of inject', function(done) {

    assert.strictEqual(async.inject, async.reduce);
    done();
  });

  it('should have alias of foldl', function(done) {

    assert.strictEqual(async.foldl, async.reduce);
    done();
  });

  it('should have alias of foldr', function(done) {

    assert.strictEqual(async.foldr, async.reduceRight);
    done();
  });

  it('should have alias of any', function(done) {

    assert.strictEqual(async.any, async.some);
    done();
  });

  it('should have alias of all', function(done) {

    assert.strictEqual(async.all, async.every);
    done();
  });
});
