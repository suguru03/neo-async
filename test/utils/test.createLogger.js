/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#createLogger', function() {

  it('should test logger', function(done) {

    var fn = function(name) {

      return function(arg, callback) {

        assert.equal(arg, name);
        callback(null, name);
      };
    };

    var names = ['log', 'dir', 'test'];
    var name = names.shift();
    var logger = async.createLogger(name);

    logger(fn(name), name, function(err, res) {
      if (err) {
        return done(err);
      }

      assert.equal(res, 'log');
      name = names.shift();
      logger = async.createLogger(name);

      logger(fn(name), name, function(err, res) {
        if (err) {
          return done(err);
        }

        assert.equal(res, 'dir');
        name = names.shift();
        logger = async.createLogger(name);

        logger(fn(name), name, function(err, res) {
          if (err) {
            return done(err);
          }

          assert.equal(res, 'test');
          done();
        });
      });
    });

  });

  it('should throw error', function(done) {

    var fn = function(name) {

      return function(arg, done, logger) {

        assert.equal(arg, name);
        logger('error');
        done('error');
      };
    };

    var names = ['log', 'debug', 'info'];
    var name = names.shift();
    var logger = async.createLogger(name);

    logger(fn(name), name, function(err) {
      assert.ok(err);
      done();
    });

  });

  it('should check logger', function(done) {

    var fn = function(arg, callback) {
      assert.strictEqual(arg, 'test');
      callback(null, 'log', 'test');
      done();
    };
    var logger = async.createLogger('warn');
    logger(fn, 'test');
  });

});
