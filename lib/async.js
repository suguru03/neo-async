(function() {

  'use strict';

  var root = this;
  var previos_async = root && root.async;

  var _nextTick;
  var _setImmediate;
  createImmediate();

  // TODO front対応
  var async = {

    // Collections
    each: each,
    eachSeries: eachSeries,
    eachLimit: eachLimit,
    forEach: each,
    forEachSeries: eachSeries,
    forEachLimit: eachLimit,
    map: map,
    mapSeries: mapSeries,
    mapLimit: mapLimit,
    filter: createFilter(),
    filterSeries: createFilter('series'),
    filterLimit: createFilter('limit'),
    reject: reject,
    rejectSeries: rejectSeries,
    rejectLimit: rejectLimit,
    detect: detect,
    detectSeries: detectSeries,
    detectLimit: detectLimit,
    pick: pick,
    pickSeries: pickSeries,
    pickLimit: pickLimit,
    reduce: reduce,
    reduceRight: reduceRight,
    transform: transform,
    transformSeries: transformSeries,
    transformLimit: transformLimit,
    sortBy: createSortBy(),
    sortBySeries: createSortBy('series'),
    sortByLimit: createSortBy('limit'),
    some: some,
    someSeries: someSeries,
    someLimit: someLimit,
    every: every,
    everySeries: everySeries,
    everyLimit: everyLimit,
    concat: concat,
    concatSeries: concatSeries,
    concatLimit: concatLimit,

    // Control Flow
    parallel: parallel,
    series: series,
    parallelLimit: parallelLimit,
    waterfall: waterfall,
    whilst: whilst,
    doWhilst: doWhilst,
    until: until,
    doUntil: doUntil,
    forever: forever,
    compose: compose,
    seq: seq,
    applyEach: createApplyEach(),
    applyEachSeries: createApplyEach('series'),
    queue: queue,
    priorityQueue: priorityQueue,
    cargo: cargo,
    auto: auto,
    retry: retry,
    iterator: iterator,
    apply: apply,
    nextTick: _nextTick,
    setImmediate: _setImmediate,
    times: times,
    timesSeries: timesSeries,
    timesLimit: timesLimit,

    // Utils
    memoize: memoize,
    unmemoize: unmemoize,
    log: createLogger('log'),
    dir: createLogger('dir'),
    createLogger: createLogger,
    noConflict: noConflict
  };

  // Node.js
  if (typeof module != 'undefined' && module.exports) {
    module.exports = async;
  }
  // AMD / RequireJS
  else if (typeof define != 'undefined' && define.amd) {
    define([], function() {
      return async;
    });
  } else {
    root.async = async;
  }

  // base on lodash
  function _keys(object) {

    return Object.keys(object);
  }

  function _isArray(array) {

    return Array.isArray(array);
  }

  function _isNumber(number) {

    return typeof number == 'number';
  }

  function _isFunction(func) {

    return typeof func == 'function';
  }

  function _toArray(collection) {

    var keys = _keys(collection);
    var index = -1;
    var length = keys.length;
    var result = Array(length);

    while(++index < length) {
      result[index] = collection[keys[index]];
    }

    return result;
  }

  function _has(object, key) {

    return object.hasOwnProperty(key);
  }


  function _arrayEach(array, iterator) {

    var index = -1;
    var length = array.length;

    while(++index < length) {
      if (iterator(array[index], index, array) === false) {
        break;
      }
    }
    return array;

  }

  function _objectEach(object, iterator, keys) {

    keys = keys || _keys(object);

    var index = -1;
    var length = keys.length;

    while(++index < length) {
      var key = keys[index];
      if (iterator(object[key], key, object) === false) {
        break;
      }
    }
    return object;

  }

  function _times(n, iterator) {

    var index = -1;
    while(++index < n) {
      iterator(index);
    }
  }

  function _arrayEvery(array, iterator) {

    var length = array.length;
    var index = -1;

    while(++index < length) {
      if (!iterator(array[index])) {
        return false;
      }
    }

    return true;
  }

  function _arrayClone(item) {

    var length = item.length;
    var index = -1;
    var result = Array(length);

    while(++index < length) {
      result[index] = item[length];
    }

    return result;
  }

  function _objectClone(item) {

    var keys = _keys(item);
    var length = keys.length;
    var index = -1;
    var result = {};

    while(++index < length) {
      var key = keys[index];
      result[key] = item[key];
    }

    return result;
  }

  function _pluck(array, key) {

    var index = -1;
    var length = array.length;
    var result = Array(length);

    while(++index < length) {
      var item = array[index] || {};
      result[index] = item[key];
    }

    return result;
  }

  function _indexOf(array, value) {

    var index = -1;
    var length = array.length;

    while(++index < length) {
      if (array[index] === value) {
        return index;
      }
    }

    return -1;
  }

  function createImmediate() {

    if (!process || !process.nextTick) {

      if (_isFunction(setImmediate)) {
        _nextTick = function(func) {
          setImmediate(func);
        };
      } else {
        _nextTick = function(func) {
          setTimeout(func, 0);
        };
      }
      _setImmediate = _nextTick;

    } else {

      _nextTick = process.nextTick;
      if (_isFunction(setImmediate)) {
        _setImmediate = function(func) {
          setImmediate(func);
        };
      } else {
        _setImmediate = _nextTick;
      }
    }

  }

  function once(func) {

    var called = false;

    return function() {

      if (called) {
        throw new Error('Callback was already called.');
      }

      called = true;
      func.apply(root, arguments);
    };
  }

  function each(collection, iterator, callback, thisArg) {

    callback = callback || function() {};

    var size = 0;
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate = function(item) {
      _iterator(item, once(done));
    };

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      _arrayEach(collection, iterate);
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      _objectEach(collection, iterate, keys);
    }

    function done(err, bool) {

      if (called) {
        return;
      }
      if (err) {
        called = true;
        return callback(err);
      }
      if (bool === false) {
        called = true;
        return callback();
      }
      if (++completed >= size) {
        called = true;
        callback();
      }
    }

  }

  function eachSeries(collection, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      iterate = function() {
        _iterator(collection[completed], once(done));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      iterate = function() {
        _iterator(collection[keys[completed]], once(done));
      };
    }

    iterate();

    function done(err, bool) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (bool === false) {
        called = true;
        return callback();
      }
      if (++completed >= size) {
        called = true;
        return callback();
      }
      iterate();
    }

  }

  function eachLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var completed = 0;
    var beforeCompleted = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          _iterator(collection[beforeCompleted + n], once(done));
        });
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          _iterator(collection[keys[beforeCompleted + n]], once(done));
        });
      };
    }

    iterate();

    function done(err, bool) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (bool === false) {
        called = true;
        return callback();
      }
      if (++completed >= size) {
        called = true;
        return callback();
      }
      if (completed >= beforeCompleted + limit) {
        beforeCompleted = completed;
        iterate();
      }
    }

  }

  function map(collection, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var result = [];
    var count = 0;
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate = function(item) {
      _iterator(item, once(createCallback(count++)));
    };

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      _arrayEach(collection, iterate);
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      _objectEach(collection, iterate, keys);
    }

    function createCallback(index) {

      return function(err, res) {

        if (called) {
          return;
        }
        result[index] = res;
        if (err) {
          called = true;
          return callback(err);
        }
        if (++completed >= size) {
          called = true;
          callback(null, result);
        }
      };
    }
  }

  function mapSeries(collection, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var result = [];
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _iterator(collection[completed], once(createCallback(completed)));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _iterator(collection[keys[completed]], once(createCallback(completed)));
      };
    }

    iterate();

    function createCallback(index) {

      return function(err, res) {

        if (called) {
          return;
        }
        result[index] = res;

        if (err) {
          called = true;
          return callback(err);
        }
        if (++completed >= size) {
          called = true;
          return callback(null, result);
        }

        iterate();
      };
    }

  }

  function mapLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var result = [];
    var completed = 0;
    var beforeCompleted = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          _iterator(collection[index], once(createCallback(index)));
        });
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          _iterator(collection[keys[index]], once(createCallback(index)));
        });
      };
    }

    iterate();

    function createCallback(index) {

      return function(err, res) {

        if (called) {
          return;
        }
        result[index] = res;

        if (err) {
          called = true;
          return callback(err);
        }
        if (++completed >= size) {
          called = true;
          return callback(null, result);
        }
        if (completed >= beforeCompleted + limit) {
          beforeCompleted = completed;
          iterate();
        }
      };
    }
  }

  function createFilter(type) {

    switch(type) {
    case 'series':
      return filterSeries;
    case 'limit':
      return filterLimit;
    default:
      return filter;
    }

    function filter(collection, iterator, callback, thisArg) {

      var done = createCallback(collection, callback);
      pick(collection, iterator, done, thisArg);
    }

    function filterSeries(collection, iterator, callback, thisArg) {

      var done = createCallback(collection, callback);
      pickSeries(collection, iterator, done, thisArg);
    }

    function filterLimit(collection, limit, iterator, callback, thisArg) {

      var done = createCallback(collection, callback);
      pickLimit(collection, limit, iterator, done, thisArg);
    }

    function createCallback(collection, callback) {

      return function(result) {

        callback(_isArray(collection) ? result : _toArray(result));
      };
    }

  }

  function reject(collection, iterator, callback, thisArg) {

    pick(collection, iterator, callback, thisArg, true);
  }

  function rejectSeries(collection, iterator, callback, thisArg) {

    pickSeries(collection, iterator, callback, thisArg, true);
  }

  function rejectLimit(collection, limit, iterator, callback, thisArg) {

    pickLimit(collection, limit, iterator, callback, thisArg, true);
  }

  function detect(collection, iterator, callback, thisArg, opposite) {

    callback = callback || function() {};
    var size = 0;
    var completed = 0;
    var called = false;
    var createCallback = getCreateCallback();
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate = function(item) {
      _iterator(item, once(createCallback(item)));
    };

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      _arrayEach(collection, iterate);
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      _objectEach(collection, iterate);
    }

    function getCreateCallback() {

      return opposite ? rejectCallback : detectCallback;

      function rejectCallback(item) {

        return function(bool) {

          if (called) {
            return;
          }

          if (!bool) {
            called = true;
            return callback(item);
          }
          if (++completed >= size) {
            called = true;
            callback();
          }
        };
      }

      function detectCallback(item) {

        return function(bool) {

          if (called) {
            return;
          }

          if (bool) {
            called = true;
            return callback(item);
          }
          if (++completed >= size) {
            called = true;
            callback();
          }
        };
      }

    }

  }

  function detectSeries(collection, iterator, callback, thisArg, opposite) {

    callback = callback || function() {};
    var size = 0;
    var completed = 0;
    var called = false;
    var createCallback = getCreateCallback();
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback([]);
      }
      iterate = function() {
        var item = collection[completed];
        _iterator(item, once(createCallback(item)));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback({});
      }
      iterate = function() {
        var item = collection[keys[completed]];
        _iterator(item, once(createCallback(item)));
      };
    }

    iterate();

    function getCreateCallback() {

      return opposite ? rejectCallback : detectCallback;

      function rejectCallback(item) {

        return function(bool) {

          if (called) {
            return;
          }
          if (!bool) {
            called = true;
            return callback(item);
          }
          if (++completed >= size) {
            called = true;
            return callback();
          }
          iterate();
        };
      }

      function detectCallback(item) {

        return function(bool) {

          if (called) {
            return;
          }
          if (bool) {
            called = true;
            return callback(item);
          }
          if (++completed >= size) {
            called = true;
            return callback();
          }
          iterate();
        };
      }
    }


  }

  function detectLimit(collection, limit, iterator, callback, thisArg, opposite) {

    callback = callback || function() {};
    var size = 0;
    var completed = 0;
    var beforeCompleted = 0;
    var called = false;
    var createCallback = getCreateCallback();
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          var item = collection[index];
          _iterator(item, once(createCallback(item)));
        });
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          var item = collection[keys[index]];
          _iterator(item, once(createCallback(item)));
        });
      };
    }

    iterate();

    function getCreateCallback() {

      return opposite ? rejectCallback : detectCallback;

      function rejectCallback(item) {

        return function(bool) {

          if (called) {
            return;
          }

          if (!bool) {
            called = true;
            return callback(item);
          }
          if (++completed >= size) {
            return callback();
          }
          if (completed >= beforeCompleted + limit) {
            beforeCompleted = completed;
            iterate();
          }
        };
      }

      function detectCallback(item) {

        return function(bool) {

          if (called) {
            return;
          }

          if (bool) {
            called = true;
            return callback(item);
          }
          if (++completed >= size) {
            return callback();
          }
          if (completed >= beforeCompleted + limit) {
            beforeCompleted = completed;
            iterate();
          }
        };
      }
    }


  }

  function pick(collection, iterator, callback, thisArg, opposite) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = {};
    var completed = 0;
    var createCallback = getCreateCallback();
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate = function(item, key) {
      _iterator(item, once(createCallback(key, item)));
    };

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback([]);
      }
      _arrayEach(collection, iterate);
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback({});
      }
      _objectEach(collection, iterate);
    }

    function getCreateCallback() {

      return opposite ? rejectCallback : pickCallback;

      function rejectCallback(key, item) {

        return function(bool) {

          if (!bool) {
            result[key + ''] = item;
          }
          if (++completed >= size) {
            callback(isArray ? _toArray(result) : result);
          }
        };
      }

      function pickCallback(key, item) {

        return function(bool) {

          if (bool) {
            result[key + ''] = item;
          }
          if (++completed >= size) {
            callback(isArray ? _toArray(result) : result);
          }
        };
      }
    }

  }

  function pickSeries(collection, iterator, callback, thisArg, opposite) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = {};
    var completed = 0;
    var createCallback = getCreateCallback();
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback([]);
      }
      iterate = function() {
        var item = collection[completed];
        _iterator(item, once(createCallback(completed, item)));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback({});
      }
      iterate = function() {
        var key = keys[completed];
        var item = collection[key];
        _iterator(item, once(createCallback(key, item)));
      };
    }

    iterate();

    function getCreateCallback() {

      return opposite ? rejectCallback : pickCallback;

      function rejectCallback(key, item) {

        return function(bool) {

          if (!bool) {
            result[key + ''] = item;
          }
          if (++completed >= size) {
            return callback(isArray ? _toArray(result) : result);
          }
          iterate();
        };
      }

      function pickCallback(key, item) {

        return function(bool) {

          if (bool) {
            result[key + ''] = item;
          }
          if (++completed >= size) {
            return callback(isArray ? _toArray(result) : result);
          }
          iterate();
        };
      }
    }
  }

  function pickLimit(collection, limit, iterator, callback, thisArg, opposite) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = {};
    var completed = 0;
    var beforeCompleted = 0;
    var createCallback = getCreateCallback();
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback([]);
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          var item = collection[index];
          _iterator(item, once(createCallback(index, item)));
        });
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback({});
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          var key = keys[index];
          var item = collection[key];
          _iterator(item, once(createCallback(key, item)));
        });
      };
    }

    iterate();

    function getCreateCallback() {

      return opposite ? rejectCallback : pickCallback;

      function rejectCallback(key, item) {

        return function(bool) {

          if (!bool) {
            result[key + ''] = item;
          }
          if (++completed >= size) {
            return callback(isArray ? _toArray(result) : result);
          }
          if (completed >= beforeCompleted + limit) {
            beforeCompleted = completed;
            iterate();
          }
        };
      }

      function pickCallback(key, item) {

        return function(bool) {

          if (bool) {
            result[key + ''] = item;
          }
          if (++completed >= size) {
            return callback(isArray ? _toArray(result) : result);
          }
          if (completed >= beforeCompleted + limit) {
            beforeCompleted = completed;
            iterate();
          }
        };
      }

    }

  }

  function reduce(collection, result, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function(result) {
        var item = collection[completed];
        _iterator(result, item, once(done));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function(result) {
        var key = keys[completed];
        var item = collection[key];
        _iterator(result, item, once(done));
      };
    }

    iterate(result);

    function done(err, result) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (++completed >= size) {
        called = true;
        return callback(null, result);
      }
      iterate(result);
    }

  }

  function reduceRight(collection, result, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function(result) {
        var item = collection[size - completed - 1];
        _iterator(result, item, once(done));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function(result) {
        var key = keys[size - completed - 1];
        var item = collection[key];
        _iterator(result, item, once(done));
      };
    }

    iterate(result);

    function done(err, result) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (++completed >= size) {
        called = true;
        return callback(null, result);
      }
      iterate(result);
    }

  }

  function transform(collection, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = isArray ? [] : {};
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate = function(item, key) {
      _iterator(result, item, key, once(done));
    };

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      _arrayEach(collection, iterate);
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      _objectEach(collection, iterate, keys);
    }

    function done(err, bool) {

      if (called) {
        return;
      }
      if (err) {
        called = true;
        return callback(err);
      }
      if (bool === false) {
        called = true;
        return callback(null, isArray ? _arrayClone(result) : _objectClone(result));
      }
      if (++completed >= size) {
        called = true;
        callback(null, result);
      }
    }

  }

  function transformSeries(collection, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = isArray ? [] : {};
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _iterator(result, collection[completed], completed, once(done));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        var key = keys[completed];
        _iterator(result, collection[key], key, once(done));
      };
    }

    iterate();

    function done(err, bool) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (bool === false) {
        called = true;
        return callback(null, result);
      }
      if (++completed >= size) {
        called = true;
        return callback(null, result);
      }
      iterate();
    }

  }

  function transformLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = isArray ? [] : {};
    var completed = 0;
    var beforeCompleted = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          var item = collection[index];
          _iterator(result, item, index, once(done));
        });
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          var key = keys[index];
          var item = collection[key];
          _iterator(result, item, key, once(done));
        });
      };
    }

    iterate();

    function done(err, bool) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (bool === false) {
        called = true;
        return callback(null, isArray ? _arrayClone(result) : _objectClone(result));
      }
      if (++completed >= size) {
        called = true;
        return callback(null, result);
      }
      if (completed >= beforeCompleted + limit) {
        beforeCompleted = completed;
        iterate();
      }
    }

  }

  function createSortBy(type) {

    switch(type) {
    case 'series':
      return sortBySeries;
    case 'limit':
      return sortByLimit;
    default:
      return sortBy;
    }

    function sortBy(collection, iterator, callback, thisArg) {

      var _iterator = createIterator(iterator, thisArg);
      map(collection, _iterator, createCallback(callback));
    }

    function sortBySeries(collection, iterator, callback, thisArg) {

      var _iterator = createIterator(iterator, thisArg);
      mapSeries(collection, _iterator, createCallback(callback));
    }

    function sortByLimit(collection, limit, iterator, callback, thisArg) {

      var _iterator = createIterator(iterator, thisArg);
      mapLimit(collection, limit, _iterator, createCallback(callback));
    }

    function createIterator(iterator, thisArg) {

      var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

      return function(item, callback) {

        _iterator(item, function(err, criteria) {
          if (err) {
            return callback(err);
          }

          callback(null, { item: item, criteria: criteria });
        });
      };
    }

    function createCallback(callback) {

      return function(err, res) {
        if (err) {
          return callback(err);
        }

        var result = res.sort(function(a, b) {
          return b.criteria < a.criteria;
        });

        callback(null, _pluck(result, 'item'));
      };
    }

  }

  function some(collection, iterator, callback, thisArg) {

    detect(collection, iterator, done, thisArg);

    function done(res) {
      callback(!!res);
    }
  }

  function someSeries(collection, iterator, callback, thisArg) {

    detectSeries(collection, iterator, done, thisArg);

    function done(res) {
      callback(!!res);
    }
  }

  function someLimit(collection, limit, iterator, callback, thisArg) {

    detectLimit(collection, limit, iterator, done, thisArg);

    function done(res) {
      callback(!!res);
    }
  }

  function every(collection, iterator, callback, thisArg) {

    detect(collection, iterator, done, thisArg, true);

    function done(res) {
      callback(!res);
    }
  }

  function everySeries(collection, iterator, callback, thisArg) {

    detectSeries(collection, iterator, done, thisArg, true);

    function done(res) {
      callback(!res);
    }
  }

  function everyLimit(collection, limit, iterator, callback, thisArg) {

    detectLimit(collection, limit, iterator, done, thisArg, true);

    function done(res) {
      callback(!res);
    }
  }

  function concat(collection, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var result = [];
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate = function(item) {
      _iterator(item, once(done));
    };

    if (_isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      _arrayEach(collection, iterate);
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      _objectEach(collection, iterate, keys);
    }

    function done(err, array) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (_isArray(array) && !!array.length) {
        Array.prototype.push.apply(result, array);
      }
      if (++completed >= size) {
        called = true;
        callback(null, result);
      }
    }

  }

  function concatSeries(collection, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = [];
    var completed = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (isArray) {
      size = collection.length;
      iterate = function() {
        _iterator(collection[completed], once(done));
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      iterate = function() {
        _iterator(collection[keys[completed]], once(done));
      };
    }

    if (!size) {
      return callback(null, result);
    }

    iterate();

    function done(err, array) {

      if (called) {
        return;
      }
      if (err) {
        called = true;
        return callback(err);
      }
      if (_isArray(array) && !!array.length) {
        Array.prototype.push.apply(result, array);
      }
      if (++completed >= size) {
        called = true;
        return callback(null, result);
      }
      iterate();
    }

  }

  function _createBaseIterator(thisArg) {

    return function(result, func, key, done) {

      var fn = thisArg ? func.bind(thisArg) : func;
      fn(function(err, res) {
        if (err) {
          return done(err);
        }

        result[key] = res;
        done();
      });
    };
  }

  function concatLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || function() {};
    var size = 0;
    var isArray = _isArray(collection);
    var result = [];
    var completed = 0;
    var beforeCompleted = 0;
    var called = false;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate;

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          _iterator(collection[index], once(done));
        });
      };
    } else {
      var keys = _keys(collection);
      size = keys.length;
      if (!size) {
        return callback(null, result);
      }
      iterate = function() {
        _times(limit, function(n) {
          if (beforeCompleted + n >= size) {
            return;
          }
          var index = beforeCompleted + n;
          _iterator(collection[keys[index]], once(done));
        });
      };
    }

    iterate();

    function done(err, array) {

      if (called) {
        return;
      }

      if (err) {
        called = true;
        return callback(err);
      }
      if (_isArray(array) && !!array.length) {
        Array.prototype.push.apply(result, array);
      }
      if (++completed >= size) {
        called = true;
        return callback(null, result);
      }
      if (completed >= beforeCompleted + limit) {
        beforeCompleted = completed;
        iterate();
      }
    }

  }

  function parallel(tasks, callback, thisArg) {

    var iterator = _createBaseIterator(thisArg);
    transform(tasks, iterator, callback, thisArg);
  }

  function series(tasks, callback, thisArg) {

    var iterator = _createBaseIterator(thisArg);
    transformSeries(tasks, iterator, callback, thisArg);
  }

  function parallelLimit(tasks, limit, callback, thisArg) {

    var iterator = _createBaseIterator(thisArg);
    transformLimit(tasks, limit, iterator, callback, thisArg);
  }

  function waterfall(tasks, callback, thisArg) {

    reduce(tasks, {}, iterator, function(err, memo) {
      if (err) {
        return callback(err);
      }
      var args = memo.args || [];
      args.unshift(err);
      callback.apply(thisArg, args);
    });

    function iterator(memo, func, done) {

      var args = memo.args || [];
      if (!args || !args.length) {
        var fn = thisArg ? func.bind(thisArg) : func;
        fn(_iterator);
      } else {
        args.push(_iterator);
        func.apply(thisArg, args);
      }

      function _iterator(err) {
        if (err) {
          return done(err);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        memo.args = args;
        done(null, memo);
      }
    }
  }

  function whilst(test, iterator, callback, thisArg) {

    callback = callback || function() {};
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    iterate();

    function iterate() {
      if (test()) {
        _iterator(function(err) {
          if (err) {
            return callback(err);
          }
          iterate();
        });
      } else {
        callback();
      }
    }
  }

  function doWhilst(iterator, test, callback, thisArg) {

    callback = callback || function() {};
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    iterate();

    function iterate() {

      _iterator(function(err) {
        if (err) {
          return callback(err);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        if (test.apply(thisArg, args)) {
          iterate();
        } else {
          callback();
        }
      });
    }

  }

  function until(test, iterator, callback, thisArg) {

    callback = callback || function() {};
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    iterate();

    function iterate() {
      if (!test()) {
        _iterator(function(err) {
          if (err) {
            return callback(err);
          }
          iterate();
        });
      } else {
        callback();
      }
    }

  }

  function doUntil(iterator, test, callback, thisArg) {

    callback = callback || function() {};
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    iterate();

    function iterate() {

      _iterator(function(err) {
        if (err) {
          return callback(err);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        if (!test.apply(thisArg, args)) {
          iterate();
        } else {
          callback();
        }
      });
    }

  }

  function forever(iterator, callback, thisArg) {

    callback = callback || function() {};
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    iterate();

    function iterate() {

      _iterator(function(err) {
        if (err) {
          return callback(err);
        }
        iterate();
      });
    }
  }

  function compose() {

    return seq.apply(null, Array.prototype.reverse.call(arguments));
  }

  function seq(/* functions... */) {

    var fns = arguments;

    return function() {

      var self = this;
      var args = Array.prototype.slice.call(arguments);
      var callback = args.pop();

      reduce(fns, args, iterator, done);

      function iterator(newargs, fn, callback) {

        var func = function(err) {
          var nextargs = Array.prototype.slice.call(arguments, 1);
          callback(err, nextargs);
        };
        newargs.push(func);
        fn.apply(self, newargs);
      }

      function done(err, res) {
        res = _isArray(res) ? res : [res];
        res.unshift(err);
        callback.apply(self, res);
      }
    };

  }

  function createApplyEach(type) {

    var func = type === 'series' ? eachSeries : each;

    return function applyEach(fns /* arguments */) {

      var self = this;
      var args = Array.prototype.slice.call(arguments, 1);
      var callback = args.pop() || function() {};

      func(fns, iterator, callback);

      function iterator(fn, done) {

        fn.apply(self, args.concat(done));
      }
    };
  }

  function queue(worker, concurrency, thisArg) {

    var q = priorityQueue(worker, concurrency, thisArg);
    q.unshift = unshift;
    q.push = push;

    return q;

    function push(tasks, callback) {

      _insert(tasks, callback);
    }

    function unshift(tasks, callback) {

      _insert(tasks, callback, true);
    }

    function _insert(tasks, callback, unshift) {

      q.started = true;
      var _tasks = _isArray(tasks) ? tasks : [tasks];

      if (!tasks || !_tasks.length) {
        return _setImmediate(function() {
          if (_isFunction(q.drain)) {
            q.drain();
          }
        });
      }

      callback = _isFunction(callback) ? callback : null;
      _arrayEach(_tasks, function(task) {

        var item = {
          task: task,
          callback: callback
        };
        if (unshift) {
          q.tasks.unshift(item);
        } else {
          q.tasks.push(item);
        }
        if (_isFunction(q.saturated) && q.length() >= q.concurrency) {
          q.saturated();
        }
        _setImmediate(q.process);
      });
    }

  }

  function priorityQueue(worker, concurrency, thisArg) {

    concurrency = concurrency || 1;

    var q = {
      tasks: [],
      concurrency: concurrency,
      saturated: null,
      empty: null,
      drain: null,
      started: false,
      paused: false,
      push: push,
      kill: kill,
      process: run,
      length: getLength,
      runnning: runnning,
      idle: idle,
      pause: pause,
      resume: resume,
      _worker: worker,
      _thisArg: thisArg
    };

    var workers = 0;

    return q;

    function _insert(tasks, priority, callback) {

      q.started = true;
      var _tasks = _isArray(tasks) ? tasks : [tasks];

      if (!tasks || !_tasks.length) {
        return _setImmediate(function() {
          if (_isFunction(q.drain)) {
            q.drain();
          }
        });
      }

      callback = _isFunction(callback) ? callback : null;
      _arrayEach(_tasks, function(task) {

        var item = {
          task: task,
          priority: priority,
          callback: callback
        };

        q.tasks.push(item);
        q.tasks = q.tasks.sort(function(a, b) {
          return b.priority < a.priority;
        });

        if (_isFunction(q.saturated) && q.length() >= q.concurrency) {
          q.saturated();
        }
        _setImmediate(q.process);
      });
    }

    function push(tasks, priority, callback) {

      _insert(tasks, priority, callback);
    }

    function kill() {

      q.drain = null;
      q.tasks = [];
    }

    function run() {

      if (q.paused || workers >= q.concurrency || q.length() === 0) {
        return;
      }
      var task = q.tasks.shift();
      if (_isFunction(q.empty) && q.length()) {
        q.empty();
      }

      workers++;
      var _worker = q._thisArg ? q._worker.bind(q._thisArg) : q._worker;
      _worker(task.task, once(next));

      function next() {

        workers--;
        if (task.callback) {
          task.callback.apply(task, arguments);
        }
        if (_isFunction(q.drain) && q.idle()) {
          q.drain();
        }

        q.process();
      }
    }

    function getLength() {

      return q.tasks.length;
    }

    function runnning() {

      return workers;
    }

    function idle() {

      return q.length() + workers === 0;
    }

    function pause() {

      q.paused = true;
    }

    function resume() {

      if (q.paused === false) {
        return;
      }
      q.paused = false;
      _times(q.concurrency, function() {
        async.setImmediate(q.process);
      });
    }
  }

  function cargo(worker, payload) {

    var c = {
      tasks: [],
      payload: payload,
      saturated: null,
      empty: null,
      drain: null,
      drained: true,
      push: push,
      process: run,
      length: getLength,
      runnning: runnning
    };

    var working = false;

    return c;

    function push(data, callback) {

      data = _isArray(data) ? data : [data];
      callback = _isFunction(callback) ? callback : null;

      _arrayEach(data, function(task) {

        c.tasks.push({
          data: task,
          callback: callback
        });
        c.drained = false;

        if (_isFunction(c.saturated) && c.length() === c.payload) {
          c.saturated();
        }
      });

      _setImmediate(c.process);
    }

    function run() {

      if (working) {
        return;
      }
      if (!c.length()) {
        if (_isFunction(c.drain) && !c.drained) {
          c.drain();
        }
        c.drained = true;
        return;
      }

      var tasks = _isNumber(c.payload) ? c.tasks.splice(0, payload) : c.tasks;
      var data = _pluck(tasks, 'data');

      // TODO ?
      if (_isFunction(c.empty)) {
        c.empty();
      }

      working = true;

      worker(data, function() {

        working = false;
        var args = arguments;
        _arrayEach(tasks, function(data) {
          if (data.callback) {
            data.callback.apply(null, args);
          }
        });

        c.process();
      });
    }

    function getLength() {

      return c.tasks.length;
    }

    function runnning() {

      return working;
    }

  }

  function auto(tasks, callback) {

    callback = once(callback) || function() {};
    var keys = _keys(tasks);
    var remainingTasks = keys.length;
    if (!remainingTasks) {
      return callback();
    }

    var listeners = [];
    var results = {};

    addListener(function() {
      if (!remainingTasks) {
        callback(null, results);
      }
    });

    _objectEach(tasks, function(task, key) {

      task = _isArray(task) ? task : [task];
      var size = task.length;
      var requires = task.slice(0, size - 1);
      var _task = task[size - 1];

      if (ready()) {
        return _task(done, results);
      }

      addListener(listener);

      function done(err) {

        var args = Array.prototype.slice.call(arguments, 1);
        if (args.length <= 1) {
          args = args[0];
        }

        if (err) {
          var safeResults = _arrayClone(results);
          safeResults[key] = args;
          return callback(err, safeResults);
        }

        results[key] = args;
        _setImmediate(taskComplete);
      }

      function ready() {

        return !_has(results, key) && _arrayEvery(requires, function(_key) {
          return _has(results, _key);
        });
      }

      function listener() {

        if (ready()) {
          removeListener(listener);
          _task(done, results);
        }
      }
    }, keys);

    function addListener(fn) {

      listeners.unshift(fn);
    }

    function removeListener(fn) {

      var index = _indexOf(listeners, fn);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }

    function taskComplete() {

      remainingTasks--;
      _arrayEach(listeners.slice(0), function(fn) {
        fn();
      });
    }

  }

  function retry(limit, task, callback) {

    var DEFAULT_TIMES = 5;
    if (_isFunction(limit)) {
      callback = task;
      task = limit;
      limit = DEFAULT_TIMES;
    }

    limit = parseInt(limit, 10) || DEFAULT_TIMES;

    return _isFunction(callback) ? wrappedTask() : wrappedTask;

    function wrappedTask(wrappedCallback, wrappedResults) {

      callback = wrappedCallback || callback || function() {};

      var result = {};

      timesSeries(limit, iterator, done);

      function done() {

        var err = result.err;
        var res = result.res;
        callback(err, res);
      }

      function iterator(n, callback) {

        task(function(err, res) {

          result = {
            err: err,
            res: res
          };

          if (!err) {
            return callback(true);
          }
          callback(err && n === (limit - 1));

        }, wrappedResults);
      }
    }

  }

  function iterator(tasks) {

    var size = 0;
    var key = 0;
    if (_isArray(tasks)) {
      size = tasks.length;
    } else {
      var keys = _keys(tasks);
      size = keys.length;
      key = keys[key];
    }
    return makeCallback(key);

    function makeCallback(index) {

      var fn = function() {
        if (size) {
          tasks[index].apply(null, arguments);
        }
        return fn.next();
      };
      fn.next = function() {
        return (index < size - 1) ? makeCallback(index + 1) : null;
      };

      return fn;
    }

  }

  function apply(func) {

    var args = Array.prototype.slice.call(arguments, 1);

    return function() {

      func.apply(null, Array.prototype.concat.apply(args, arguments));
    };
  }


  function times(n, iterator, callback, thisArg) {

    callback = callback || function() {};
    var result = [];
    if (n < 1) {
      return callback(null, result);
    }

    var called = false;
    var completed = 0;

    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    _times(n, function(num) {
      _iterator(num, once(createCallback(num)));
    });

    function createCallback(index) {

      return function(err, res) {

        if (called) {
          return;
        }
        result[index] = res;
        if (err) {
          called = true;
          return callback(err);
        }
        if (++completed >= n) {
          called = true;
          callback(null, result);
        }
      };
    }

  }

  function timesSeries(n, iterator, callback, thisArg) {

    callback = callback || function() {};
    var result = [];
    if (n < 1) {
      return callback(null, result);
    }

    var called = false;
    var completed = 0;

    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    var iterate = function() {
      _iterator(completed, once(createCallback(completed)));
    };

    iterate();

    function createCallback(index) {

      return function(err, res) {

        if (called) {
          return;
        }
        result[index] = res;

        if (err) {
          called = true;
          return callback(err);
        }
        if (++completed >= n) {
          called = true;
          return callback(null, result);
        }

        iterate();
      };
    }

  }

  function timesLimit(n, limit, iterator, callback, thisArg) {

    callback = callback || function() {};
    var result = [];
    if (n < 1) {
      return callback(null, result);
    }

    var called = false;
    var completed = 0;
    var beforeCompleted = 0;

    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    var iterate = function() {
      _times(limit, function(num) {
        if (beforeCompleted + num >= n) {
          return;
        }
        var index = beforeCompleted + num;
        _iterator(index, once(createCallback(index)));
      });
    };
    iterate();

    function createCallback(index) {

      return function done(err, res) {

        if (called) {
          return;
        }
        result[index] = res;

        if (err) {
          called = true;
          return callback(err);
        }
        if (++completed >= n) {
          called = true;
          return callback(null, result);
        }
        if (completed >= beforeCompleted + limit) {
          beforeCompleted = completed;
          iterate();
        }
      };
    }

  }

  function memoize(fn, hasher, thisArg) {

    hasher = hasher || function (hash) {
      return hash;
    };

    var memo = {};
    var queues = {};
    var memoized = function() {

      var args = Array.prototype.slice.call(arguments);
      var callback = args.pop();
      var key = hasher.apply(null, args);
      if (_has(memo, key)) {
        _nextTick(function() {
          callback.apply(thisArg, memo[key]);
        });
        return;
      }
      if (_has(queues, key)) {
        return queues[key].push(callback);
      }

      queues[key] = [callback];

      args.push(done);
      fn.apply(thisArg, args);

      function done() {

        memo[key] = arguments;
        var q = queues[key];
        delete queues[key];

        var i = -1;
        var length = q.length;
        while(++i < length) {
          q[i].apply(thisArg, arguments);
        }
      }
    };

    memoized.memo = memo;
    memoized.unmemoized = fn;

    return memoized;

  }

  function unmemoize(fn) {

    return function() {

      return (fn.unmemoized || fn).apply(null, arguments);
    };
  }

  function createLogger(name) {

    return function(fn) {

      var args = Array.prototype.slice.call(arguments, 1);
      args.push(done);
      fn.apply(null, args);
    };

    function done(err) {

      var args = Array.prototype.slice.call(arguments, 1);
      if (!console) {
        return;
      }
      if (err) {
        if (console.error) {
          console.error(err);
        } else if (console.log) {
          console.log(err);
        }
        return;
      }

      if (console[name]) {
        _arrayEach(args, console[name]);
      }
    }
  }

  function noConflict() {

    root.async = previos_async;
    return async;
  }

}.call(this));

