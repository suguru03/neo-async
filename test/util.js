/* global it */
'use strict';

var _it = typeof Symbol === 'function' ? it : it.skip;
_it.only = _it.only || function skipOnly(key) {
  it.only(key);
};

exports.it = _it;

/**
 * for v0.10.x
 */
exports.Map = typeof Map === 'function' ? Map : (function() {
 function Map() {
   this._data = [];
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
