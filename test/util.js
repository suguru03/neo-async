/* global it, Map, Set, Promise */
'use strict';

var assert = require('assert');

var _it = typeof Symbol === 'function' ? it : it.skip;
_it.only =
  _it.only ||
  function skipOnly(key) {
    it.only(key);
  };

exports.it = _it;

/**
 * for v0.10.x
 */
exports.Map =
  typeof Map === 'function'
    ? Map
    : (function() {
        function Map(arr) {
          this._data = arr || [];
        }
        Map.prototype.set = function(key, value) {
          this._data.push([key, value]);
        };
        Map.prototype[global.Symbol.iterator] = function() {
          var self = this;
          return {
            next: function() {
              var data = self._data.shift();
              return {
                value: data,
                done: data === undefined
              };
            }
          };
        };
        Object.defineProperty(Map.prototype, 'size', {
          get: function() {
            return this._data.length;
          }
        });
        return Map;
      })();

exports.Set =
  typeof Set === 'function'
    ? Set
    : (function() {
        function Set(arr) {
          this._data = arr || [];
        }
        Set.prototype.add = function(value) {
          this._data.push(value);
        };
        Set.prototype[global.Symbol.iterator] = function() {
          var self = this;
          return {
            next: function() {
              var data = self._data.shift();
              return {
                value: data,
                done: data === undefined
              };
            }
          };
        };
        Object.defineProperty(Set.prototype, 'size', {
          get: function() {
            return this._data.length;
          }
        });
        return Set;
      })();

exports.errorChecker = function(err) {
  assert.ok(err);
  assert.strictEqual(err.message, 'Callback was already called.');
};

exports.uncaughtExceptionHandler = function(func) {
  var handler = function(err) {
    func(err);
    process.removeListener('uncaughtException', handler);
  };
  process.removeAllListeners('uncaughtException');
  process.domain = null;
  process.on('uncaughtException', handler);
};

exports.Promise = typeof Promise !== 'undefined' ? Promise : require('bluebird');

exports.makeGenerator = function*(arr) {
  var idx = 0;
  var len = arr.length;
  while (idx < len) {
    yield arr[idx++];
  }
};
