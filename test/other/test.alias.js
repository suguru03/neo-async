/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = require('../../');

parallel('#alias', function() {

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

  it('should have alias of eachOf', function(done) {

    assert.strictEqual(async.eachOf, async.each);
    done();
  });

  it('should have alias of eachOfSeries', function(done) {

    assert.strictEqual(async.eachOfSeries, async.eachSeries);
    done();
  });

  it('should have alias of eachLimit', function(done) {

    assert.strictEqual(async.eachOfLimit, async.eachLimit);
    done();
  });

  it('should have alias of forEachOf', function(done) {

    assert.strictEqual(async.forEachOf, async.each);
    done();
  });

  it('should have alias of forEachOfSeries', function(done) {

    assert.strictEqual(async.forEachOfSeries, async.eachSeries);
    done();
  });

  it('should have alias of forEachOfLimit', function(done) {

    assert.strictEqual(async.forEachOfLimit, async.eachLimit);
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

  it('should have alias of angelfall', function(done) {

    assert.strictEqual(async.angelfall, async.angelFall);
    done();
  });

  it('should have alias of wrapSync', function(done) {

    assert.strictEqual(async.wrapSync, async.asyncify);
    done();
  });
});
