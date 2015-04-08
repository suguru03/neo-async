(function() {

  'use strict';

  var root = this;
  var previos_async = root && root.async;
  var noop = function() {};

  var objectTypes = {
    'function': true,
    'object': true
  };

  var _nextTick;
  var _setImmediate;
  createImmediate();

  var async = {
    VERSION: '0.6.2',

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
    mapValues: mapValues,
    mapValuesSeries: mapValuesSeries,
    mapValuesLimit: mapValuesLimit,
    filter: filter,
    filterSeries: filterSeries,
    filterLimit: filterLimit,
    select: filter,
    selectSeries: filterSeries,
    selectLimit: filterLimit,
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
    inject: reduce,
    foldl: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    transform: transform,
    transformSeries: transformSeries,
    transformLimit: transformLimit,
    sortBy: createSortBy(),
    sortBySeries: createSortBy('series'),
    sortByLimit: createSortBy('limit'),
    some: some,
    someSeries: someSeries,
    someLimit: someLimit,
    any: some,
    every: every,
    all: every,
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
    noConflict: noConflict,
    eventEmitter: eventEmitter,
    EventEmitter: EventEmitter
  };

  if (objectTypes[typeof define] && define && define.amd) {
    // AMD / RequireJS
    define([], function() {
      return async;
    });
  } else if (objectTypes[typeof module] && module && module.exports) {
    // Node.js
    module.exports = async;
  } else if (root && objectTypes[typeof root.async]) {
    root.neo_async = async;
  } else {
    root.async = async;
  }

  // base on lodash
  function _toArray(collection) {
    var keys = Object.keys(collection);
    var index = -1;
    var length = keys.length;
    var result = Array(length);

    while (++index < length) {
      result[index] = collection[keys[index]];
    }
    return result;
  }

  function _baseSlice(array) {
    var index = -1;
    var length = array.length;
    var result = Array(length);

    while (++index < length) {
      result[index] = array[index];
    }
    return result;
  }

  function _slice(array, start) {
    var end = array.length;
    var index = -1;
    var size = end - start;
    if (size <= 0) {
      return [];
    }
    var result = Array(size);

    while (++index < size) {
      result[index] = array[index + start];
    }
    return result;
  }

  function _compact(array) {
    var index = -1;
    var length = array.length;
    var resIndex = -1;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[++resIndex] = value;
      }
    }
    return result;
  }

  function _reverse(array) {
    var index = -1;
    var length = array.length;
    var result = Array(length);
    var resIndex = length;

    while (++index < length) {
      result[--resIndex] = array[index];
    }
    return result;
  }

  function _has(object, key) {
    return object.hasOwnProperty(key);
  }

  function _arrayEach(array, iterator) {
    var index = -1;
    var length = array.length;

    while (++index < length) {
      iterator(array[index], index);
    }
    return array;
  }

  function _objectEach(object, iterator, keys) {
    keys = keys || Object.keys(object);
    var index = -1;
    var length = keys.length;

    while (++index < length) {
      var key = keys[index];
      iterator(object[key], key);
    }
    return object;
  }

  function _times(n, iterator) {
    var index = -1;
    while (++index < n) {
      iterator(index);
    }
  }

  function _arrayEvery(array, iterator) {
    var length = array.length;
    var index = -1;

    while (++index < length) {
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

    while (++index < length) {
      result[index] = item[index];
    }
    return result;
  }

  function _objectClone(item) {
    var keys = Object.keys(item);
    var length = keys.length;
    var index = -1;
    var result = {};

    while (++index < length) {
      var key = keys[index];
      result[key] = item[key];
    }
    return result;
  }

  function _pluck(array, key) {
    var index = -1;
    var length = array.length;
    var result = Array(length);

    while (++index < length) {
      var item = array[index] || {};
      result[index] = item[key];
    }
    return result;
  }

  function _indexOf(array, value) {
    var index = -1;
    var length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
  }

  function createImmediate() {
    if (!objectTypes[typeof process] || !process.nextTick) {
      if (objectTypes[typeof setImmediate]) {
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
      if (objectTypes[typeof setImmediate]) {
        _setImmediate = function(func) {
          setImmediate(func);
        };
      } else {
        _setImmediate = _nextTick;
      }
    }
  }

  function once(func, arg1, arg2) {
    var called = false;
    return function(err, res) {
      if (called) {
        if (err) {
          return func(err, res);
        }
        throw new Error('Callback was already called.');
      }
      called = true;
      func(err, res, arg1, arg2);
    };
  }

  function onceWithoutError(func, arg1, arg2) {
    var called = false;
    return function(res) {
      if (called) {
        throw new Error('Callback was already called.');
      }
      called = true;
      func(res, arg1, arg2);
    };
  }

  /* parallel iterators */

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   */
  function _arrayIterator(params) {
    var iterator = params.iterator;
    var done = params.done;
    _arrayEach(params.collection, function(value, index) {
      iterator(value, once(done, index, value));
    });
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   */
  function _arrayIteratorWithIndex(params) {
    var iterator = params.iterator;
    var done = params.done;
    _arrayEach(params.collection, function(value, index) {
      iterator(value, index, once(done, index, value));
    });
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   */
  function _arrayPickIterator(params) {
    var iterator = params.iterator;
    var done = params.done;
    _arrayEach(params.collection, function(value, index) {
      iterator(value, onceWithoutError(done, index, value));
    });
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   */
  function _arrayPickIteratorWithIndex(params) {
    var iterator = params.iterator;
    var done = params.done;
    _arrayEach(params.collection, function(value, index) {
      iterator(value, index, onceWithoutError(done, index, value));
    });
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Array|Object} params.result
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   */
  function _arrayTransformIterator(params) {
    var iterator = params.iterator;
    var done = params.done;
    var result = params.result;
    _arrayEach(params.collection, function(value) {
      iterator(result, value, once(done));
    });
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Array|Object} params.result
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   */
  function _arrayTransformIteratorWithIndex(params) {
    var iterator = params.iterator;
    var done = params.done;
    var result = params.result;
    _arrayEach(params.collection, function(value, index) {
      iterator(result, value, index, once(done));
    });
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectIterator(params) {
    var iterator = params.iterator;
    var done = params.done;
    _objectEach(params.collection, function(value, key) {
      iterator(value, once(done, key, value));
    }, params.keys);
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectIteratorWithKey(params) {
    var iterator = params.iterator;
    var done = params.done;
    _objectEach(params.collection, function(value, key) {
      iterator(value, key, once(done, key, value));
    }, params.keys);
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectPickIterator(params) {
    var iterator = params.iterator;
    var done = params.done;
    _objectEach(params.collection, function(value, key) {
      iterator(value, onceWithoutError(done, key, value));
    }, params.keys);
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectPickIteratorWithKey(params) {
    var iterator = params.iterator;
    var done = params.done;
    _objectEach(params.collection, function(value, key) {
      iterator(value, key, onceWithoutError(done, key, value));
    }, params.keys);
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectMapIterator(params) {
    var iterator = params.iterator;
    var done = params.done;
    var started = 0;
    _objectEach(params.collection, function(value) {
      iterator(value, once(done, started++));
    }, params.keys);
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectMapIteratorWithKey(params) {
    var iterator = params.iterator;
    var done = params.done;
    var started = 0;
    _objectEach(params.collection, function(value, key) {
      iterator(value, key, once(done, started++));
    }, params.keys);
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Array|Object} params.result
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectTransformIterator(params) {
    var iterator = params.iterator;
    var done = params.done;
    var result = params.result;
    _objectEach(params.collection, function(value) {
      iterator(result, value, once(done));
    }, params.keys);
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Array|Object} params.result
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Array} params.keys
   */
  function _objectTransformIteratorWithKey(params) {
    var iterator = params.iterator;
    var done = params.done;
    var result = params.result;
    _objectEach(params.collection, function(value, key) {
      iterator(result, value, key, once(done));
    }, params.keys);
  }

  /* series iterator */

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Boolean} params.called
   * @param {Number} params.completed
   */
  function _arraySeriesIterator(params) {
    params.called = false;
    params.iterator(params.collection[params.completed], params.done);
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Boolean} params.called
   * @param {Number} params.completed
   */
  function _arraySeriesIteratorWithIndex(params) {
    var completed = params.completed;
    params.called = false;
    params.iterator(params.collection[completed], completed, params.done);
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Boolean} params.called
   * @param {Number} params.completed
   * @param {Array} params.keys
   */
  function _objectSeriesIterator(params) {
    params.called = false;
    params.iterator(params.collection[params.keys[params.completed]], params.done);
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.done
   * @param {Boolean} params.called
   * @param {Number} params.completed
   * @param {Array} params.keys
   */
  function _objectSeriesIteratorWithKey(params) {
    params.called = false;
    var key = params.keys[params.completed];
    params.iterator(params.collection[key], key, params.done);
  }

  function each(collection, iterator, callback, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done
    };
    var size;
    var completed = 0;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      if (iterator.length === 3) {
        _arrayIteratorWithIndex(params);
      } else {
        _arrayIterator(params);
      }
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return callback();
      }
      if (iterator.length === 3) {
        _objectIteratorWithKey(params);
      } else {
        _objectIterator(params);
      }
    } else {
      callback();
    }

    function done(err, bool) {
      if (err) {
        callback(err);
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback();
        callback = noop;
        return;
      }
      if (bool === false) {
        callback();
        callback = noop;
      }
    }
  }

  function eachSeries(collection, iterator, callback, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      called: false,
      completed: 0,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done
    };
    var size, iterate;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? _arraySeriesIteratorWithIndex : _arraySeriesIterator;
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? _objectSeriesIteratorWithKey : _objectSeriesIterator;
    } else {
      return callback();
    }

    iterate(params);

    function done(err, bool) {
      if (params.called) {
        throw new Error('Callback was already called.');
      }
      params.called = true;
      if (err) {
        return callback(err);
      }
      if (++params.completed === size) {
        return callback();
      }
      if (bool === false) {
        return callback();
      }
      iterate(params);
    }
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.done
   * @param {Number} params.started
   * @param {Number} params.size
   */
  function _arrayEachLimitIterator(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    params.iterator(params.collection[index], once(params.done));
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.done
   * @param {Number} params.started
   * @param {Number} params.size
   */
  function _arrayEachLimitIteratorWithIndex(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    params.iterator(params.collection[index], index, once(params.done));
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.done
   * @param {Number} params.started
   * @param {Number} params.size
   * @param {Array} params.keys
   */
  function _objectEachLimitIterator(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    params.iterator(params.collection[params.keys[index]], once(params.done));
  }

  /**
   * @param {Object} params
   * @param {Object} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.done
   * @param {Number} params.started
   * @param {Number} params.size
   * @param {Array} params.keys
   */
  function _objectEachLimitIteratorWithKey(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    var key = params.keys[index];
    params.iterator(params.collection[key], key, once(params.done));
  }

  function eachLimit(collection, limit, iterator, callback, thisArg) {
    callback = callback || noop;
    if (isNaN(limit) || limit < 1) {
      return callback();
    }
    var params = {
      collection: collection,
      keys: undefined,
      started: 0,
      size: 0,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done
    };
    var size, iterate;
    var completed = 0;

    if (Array.isArray(collection)) {
      size = params.size = collection.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? _arrayEachLimitIteratorWithIndex : _arrayEachLimitIterator;
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.size = params.keys.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? _objectEachLimitIteratorWithKey : _objectEachLimitIterator;
    } else {
      return callback();
    }

    _times(limit > size ? size : limit, function() {
      iterate(params);
    });

    function done(err, bool) {
      if (err) {
        callback(err);
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback();
        callback = noop;
        return;
      }
      if (bool === false) {
        callback();
        callback = noop;
        return;
      }
      iterate(params);
    }
  }

  function map(collection, iterator, callback, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      started: 0,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done
    };
    var size, result;
    var completed = 0;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, []);
      }
      result = Array(size);
      if (iterator.length === 3) {
        _arrayIteratorWithIndex(params);
      } else {
        _arrayIterator(params);
      }
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return callback(undefined, []);
      }
      result = Array(size);
      if (iterator.length === 3) {
        _objectMapIteratorWithKey(params);
      } else {
        _objectMapIterator(params);
      }
    } else {
      callback(undefined, []);
    }

    function done(err, res, index) {
      result[index] = res;
      if (err) {
        callback(err, _arrayClone(result));
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback(undefined, result);
        callback = noop;
        return;
      }
    }
  }

  /**
   * @param {Object} params
   * @param {Array|Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.createcallback
   * @param {Number} params.completed
   */
  function _arrayMapSeriesIterator(params) {
    var completed = params.completed;
    params.iterator(params.collection[completed], params.createCallback(completed));
  }

  /**
   * @param {Object} params
   * @param {Array|Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.createcallback
   * @param {Number} params.completed
   */
  function _arrayMapSeriesIteratorWithIndex(params) {
    var completed = params.completed;
    params.iterator(params.collection[completed], completed, params.createCallback(completed));
  }

  /**
   * @param {Object} params
   * @param {Array|Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.createcallback
   * @param {Number} params.completed
   * @param {Array} params.keys
   */
  function _objectMapSeriesIterator(params) {
    var completed = params.completed;
    params.iterator(params.collection[params.keys[completed]], params.createCallback(completed));
  }

  /**
   * @param {Object} params
   * @param {Array|Object} params.collection
   * @param {Function} params.iterator
   * @param {Funciton} params.createcallback
   * @param {Number} params.completed
   * @param {Array} params.keys
   */
  function _objectMapSeriesIteratorWithKey(params) {
    var key = params.keys[params.completed];
    params.iterator(params.collection[key], key, params.createCallback(params.completed));
  }

  function mapSeries(collection, iterator, callback, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      completed: 0,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      createCallback: createCallback
    };
    var size, result, iterate;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, []);
      }
      iterate = iterator.length === 3 ? _arrayMapSeriesIteratorWithIndex : _arrayMapSeriesIterator;
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return callback(undefined, []);
      }
      iterate = iterator.length === 3 ? _objectMapSeriesIteratorWithKey : _objectMapSeriesIterator;
    } else {
      return callback(undefined, []);
    }

    result = Array(size);
    iterate(params);

    function createCallback(index) {
      var called = false;
      return function(err, res) {
        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        result[index] = res;
        if (err) {
          callback(err, _arrayClone(result));
          callback = noop;
          return;
        }
        if (++params.completed === size) {
          callback(undefined, result);
          callback = noop;
          return;
        }
        iterate(params);
      };
    }
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.createcallback
   * @param {Number} params.started
   * @param {Number} params.size
   */
  function _arrayMapLimitIterator(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    params.iterator(params.collection[index], params.createCallback(index));
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.createcallback
   * @param {Number} params.started
   * @param {Number} params.size
   */
  function _arrayMapLimitIteratorWithIndex(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    params.iterator(params.collection[index], index, params.createCallback(index));
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.createcallback
   * @param {Number} params.started
   * @param {Number} params.size
   */
  function _objectMapLimiteIterator(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    params.iterator(params.collection[params.keys[index]], params.createCallback(index));
  }

  /**
   * @param {Object} params
   * @param {Array} params.collection
   * @param {Function} params.iterator
   * @param {Function} params.createcallback
   * @param {Number} params.started
   * @param {Number} params.size
   */
  function _objectMapLimiteIteratorWithKey(params) {
    var index = params.started++;
    if (index >= params.size) {
      return;
    }
    var key = params.keys[index];
    params.iterator(params.collection[key], key, params.createCallback(index));
  }

  function mapLimit(collection, limit, iterator, callback, thisArg) {
    callback = callback || noop;
    if (isNaN(limit) || limit < 1) {
      return callback(undefined, []);
    }
    var params = {
      collection: collection,
      keys: undefined,
      started: 0,
      size: 0,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      createCallback: createCallback
    };
    var size, result, iterate;
    var completed = 0;

    if (Array.isArray(collection)) {
      size = params.size = collection.length;
      if (!size) {
        return callback(undefined, []);
      }
      iterate = iterator.length === 3 ? _arrayMapLimitIteratorWithIndex : _arrayMapLimitIterator;
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.size = params.keys.length;
      if (!size) {
        return callback(undefined, []);
      }
      iterate = iterator.length === 3 ? _objectMapLimiteIteratorWithKey : _objectMapLimiteIterator;
    } else {
      return callback(undefined, []);
    }

    result = Array(size);
    _times(limit > size ? size : limit, function() {
      iterate(params);
    });

    function createCallback(index) {
      var called = false;
      return function(err, res) {
        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        result[index] = res;
        if (err) {
          callback(err, _arrayClone(result));
          callback = noop;
          return;
        }
        if (++completed === size) {
          callback(undefined, result);
          callback = noop;
          return;
        }
        iterate(params);
      };
    }
  }

  function mapValues(collection, iterator, callback, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      started: 0,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done
    };
    var size;
    var result = {};
    var completed = 0;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      if (iterator.length === 3) {
        _arrayIteratorWithIndex(params);
      } else {
        _arrayIterator(params);
      }
    } else if (collection && typeof collection === 'object') {
      var keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      if (iterator.length === 3) {
        _objectIteratorWithKey(params);
      } else {
        _objectIterator(params);
      }
    } else {
      callback(undefined, result);
    }

    function done(err, res, key) {
      result[key] = res;
      if (err) {
        callback(err, _objectClone(result));
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback(undefined, result);
        callback = noop;
        return;
      }
    }
  }

  function mapValuesSeries(collection, iterator, callback, thisArg) {

    callback = callback || noop;
    var size, keys, iterate;
    var result = {};
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, {});
      }
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback(undefined, {});
      }
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback(undefined, {});
    }

    iterate();

    function arrayIterator() {
      _iterator(collection[completed], createCallback(completed));
    }

    function arrayIteratorWithIndex() {
      _iterator(collection[completed], completed, createCallback(completed));
    }

    function objectIterator() {
      var key = keys[completed];
      _iterator(collection[key], createCallback(key));
    }

    function objectIteratorWithKey() {
      var key = keys[completed];
      _iterator(collection[key], key, createCallback(key));
    }

    function createCallback(key) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }

        called = true;
        result[key] = res;

        if (err) {
          callback(err, _objectClone(result));
          callback = noop;
          return;
        }
        if (++completed === size) {
          callback(undefined, result);
          callback = noop;
          return;
        }
        iterate();
      };
    }

  }

  function mapValuesLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || noop;
    if (isNaN(limit) || limit < 1) {
      return callback(undefined, []);
    }

    var size, keys, iterate;
    var result = {};
    var started = 0;
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback(undefined, result);
    }

    _times(limit > size ? size : limit, iterate);

    function arrayIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(collection[index], createCallback(index));
    }

    function arrayIteratorWithIndex() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(collection[index], index, createCallback(index));
    }

    function objectIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      _iterator(collection[key], createCallback(key));
    }

    function objectIteratorWithKey() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      _iterator(collection[key], key, createCallback(key));
    }

    function createCallback(key) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }

        called = true;
        result[key] = res;

        if (err) {
          callback(err, _objectClone(result));
          callback = noop;
          return;
        }
        if (++completed === size) {
          callback(undefined, result);
          callback = noop;
          return;
        }
        iterate();
      };
    }
  }

  function filter(collection, iterator, callback, thisArg) {

    callback = callback || noop;

    if (Array.isArray(collection)) {
      pick(collection, iterator, callback, thisArg);
    } else {
      pick(collection, iterator, callback.length === 2 ? doneWithError : done, thisArg);
    }

    function done(res) {
      callback(_toArray(res));
    }

    function doneWithError(err, res) {
      callback(err, _toArray(res));
    }
  }

  function filterSeries(collection, iterator, callback, thisArg) {

    callback = callback || noop;

    if (Array.isArray(collection)) {
      pickSeries(collection, iterator, callback, thisArg);
    } else {
      pickSeries(collection, iterator, callback.length === 2 ? doneWithError : done, thisArg);
    }

    function done(res) {
      callback(_toArray(res));
    }

    function doneWithError(err, res) {
      callback(err, _toArray(res));
    }
  }

  function filterLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || noop;
    var enableError = callback.length === 2;
    if (isNaN(limit) || limit < 1) {
      return enableError ? callback(undefined, []) : callback([]);
    }

    var size, keys, iterate, result;
    var started = 0;
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var createCallback = enableError ? arrayCallbackWithError : arrayCallback;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return enableError ? callback(undefined, []) : callback([]);
      }
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return enableError ? callback(undefined, []) : callback([]);
      }
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return enableError ? callback(undefined, []) : callback([]);
    }

    result = Array(size);
    _times(limit > size ? size : limit, iterate);

    function arrayIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[index];
      _iterator(value, createCallback(value, index));
    }

    function arrayIteratorWithIndex() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[index];
      _iterator(value, index, createCallback(value, index));
    }

    function objectIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[keys[index]];
      _iterator(value, createCallback(value, index));
    }

    function objectIteratorWithKey() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      var value = collection[key];
      _iterator(value, key, createCallback(value, index));
    }

    function arrayCallback(value, index) {

      var called = false;

      return function(res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (res) {
          result[index] = value;
        }
        if (++completed === size) {
          callback(_compact(result));
        }
        iterate();
      };
    }

    function arrayCallbackWithError(value, index) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }

        called = true;
        if (err) {
          callback(err, _compact(result));
          callback = noop;
          return;
        }
        if (res) {
          result[index] = value;
        }
        if (++completed === size) {
          return callback(undefined, _compact(result));
        }
        iterate();
      };
    }
  }

  function reject(collection, iterator, callback, thisArg) {

    if (collection && typeof collection === 'object') {
      collection = _toArray(collection);
    }
    pick(collection, iterator, callback, thisArg, true);
  }

  function rejectSeries(collection, iterator, callback, thisArg) {

    if (collection && typeof collection === 'object') {
      collection = _toArray(collection);
    }
    pickSeries(collection, iterator, callback, thisArg, true);
  }

  function rejectLimit(collection, limit, iterator, callback, thisArg) {

    if (collection && typeof collection === 'object') {
      collection = _toArray(collection);
    }
    pickLimit(collection, limit, iterator, callback, thisArg, true);
  }

  function detect(collection, iterator, callback, thisArg, opposite) {
    callback = callback || noop;
    var enableError = callback.length === 2;
    var params = {
      collection: collection,
      keys: undefined,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: enableError ? doneWithError : done
    };
    var size;
    var bool = !opposite;
    var completed = 0;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      if (enableError) {
        if (iterator.length === 3) {
          _arrayIteratorWithIndex(params);
        } else {
          _arrayIterator(params);
        }
      } else {
        if (iterator.length === 3) {
          _arrayPickIteratorWithIndex(params);
        } else {
          _arrayPickIterator(params);
        }
      }
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return callback();
      }
      if (enableError) {
        if (iterator.length === 3) {
          _objectIteratorWithKey(params);
        } else {
          _objectIterator(params);
        }
      } else {
        if (iterator.length === 3) {
          _objectPickIteratorWithKey(params);
        } else {
          _objectPickIterator(params);
        }
      }
    } else {
      callback();
    }

    function done(res, key, value) {
      if (!!res === bool) {
        callback(value);
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback();
        callback = noop;
      }
    }

    function doneWithError(err, res, key, value) {
      if (err) {
        callback(err);
        callback = noop;
        return;
      }
      if (!!res === bool) {
        callback(undefined, value);
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback();
        callback = noop;
      }
    }
  }

  function detectSeries(collection, iterator, callback, thisArg, opposite) {

    callback = callback || noop;
    var size, iterate, called;
    var completed = 0;
    var bool = !opposite;
    var createCallback = callback.length === 2 ? detectCallbackWithError : detectCallback;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      var keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback();
    }

    iterate();

    function arrayIterator() {
      called = false;
      var value = collection[completed];
      _iterator(value, createCallback(value));
    }

    function arrayIteratorWithIndex() {
      called = false;
      var value = collection[completed];
      _iterator(value, completed, createCallback(value));
    }

    function objectIterator() {
      called = false;
      var value = collection[keys[completed]];
      _iterator(value, createCallback(value));
    }

    function objectIteratorWithKey() {
      called = false;
      var key = keys[completed];
      var value = collection[key];
      _iterator(value, key, createCallback(value));
    }

    function detectCallback(value) {

      return function(res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (!!res === bool) {
          return callback(value);
        }
        if (++completed === size) {
          return callback();
        }
        iterate();
      };
    }

    function detectCallbackWithError(value) {

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          return callback(err);
        }
        if (!!res === bool) {
          return callback(undefined, value);
        }
        if (++completed === size) {
          return callback();
        }
        iterate();
      };
    }

  }

  function detectLimit(collection, limit, iterator, callback, thisArg, opposite) {

    callback = callback || noop;
    if (isNaN(limit) || limit < 1) {
      return callback();
    }

    var size, iterate;
    var started = 0;
    var completed = 0;
    var bool = !opposite;
    var createCallback = callback.length === 2 ? detectCallbackWithError : detectCallback;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      var keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback();
      }
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback();
    }

    _times(limit > size ? size : limit, iterate);

    function arrayIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[index];
      _iterator(value, createCallback(value));
    }

    function arrayIteratorWithIndex() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[index];
      _iterator(value, index, createCallback(value));
    }

    function objectIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[keys[index]];
      _iterator(value, createCallback(value));
    }

    function objectIteratorWithKey() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      var value = collection[key];
      _iterator(value, key, createCallback(value));
    }

    function detectCallback(value) {

      var called = false;

      return function(res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (!!res === bool) {
          callback(value);
          callback = noop;
          return;
        }
        if (++completed === size) {
          callback();
          callback = noop;
          return;
        }
        iterate();
      };
    }

    function detectCallbackWithError(value) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          callback(err);
          callback = noop;
          return;
        }
        if (!!res === bool) {
          callback(undefined, value);
          callback = noop;
          return;
        }
        if (++completed === size) {
          callback();
          callback = noop;
          return;
        }
        iterate();
      };
    }

  }

  function pick(collection, iterator, callback, thisArg, opposite) {
    callback = callback || noop;
    var enableError = callback.length === 2;
    var params = {
      collection: collection,
      keys: undefined,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: undefined
    };
    var size, result;
    var bool = !opposite;
    var completed = 0;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return enableError ? callback(undefined, []) : callback([]);
      }
      result = Array(size);
      if (enableError) {
        params.done = arrayCallbackWithError;
        if (iterator.length === 3) {
          _arrayIteratorWithIndex(params);
        } else {
          _arrayIterator(params);
        }
      } else {
        params.done = arrayCallback;
        if (iterator.length === 3) {
          _arrayPickIteratorWithIndex(params);
        } else {
          _arrayPickIterator(params);
        }
      }
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return enableError ? callback(undefined, {}) : callback({});
      }
      result = {};
      if (enableError) {
        params.done = objectCallbackWithError;
        if (iterator.length === 3) {
          _objectIteratorWithKey(params);
        } else {
          _objectIterator(params);
        }
      } else {
        params.done = objectCallback;
        if (iterator.length === 3) {
          _objectPickIteratorWithKey(params);
        } else {
          _objectPickIterator(params);
        }
      }
    } else {
      return enableError ? callback(undefined, []) : callback([]);
    }

    function arrayCallback(res, index, value) {
      if (!!res === bool) {
        result[index] = value;
      }
      if (++completed === size) {
        callback(_compact(result));
      }
    }

    function arrayCallbackWithError(err, res, index, value) {
      if (err) {
        callback(err, _compact(result));
        callback = noop;
        return;
      }
      if (!!res === bool) {
        result[index] = value;
      }
      if (++completed === size) {
        callback(undefined, _compact(result));
      }
    }

    function objectCallback(res, key, value) {
      if (!!res === bool) {
        result[key] = value;
      }
      if (++completed === size) {
        callback(result);
      }
    }

    function objectCallbackWithError(err, res, key, value) {
      if (err) {
        callback(err, _objectClone(result));
        callback = noop;
        return;
      }
      if (!!res === bool) {
        result[key] = value;
      }
      if (++completed === size) {
        callback(undefined, result);
      }
    }
  }

  function pickSeries(collection, iterator, callback, thisArg, opposite) {

    callback = callback || noop;
    var size, keys, iterate, result, createCallback;
    var bool = !opposite;
    var completed = 0;
    var resultCount = -1;
    var enableError = callback.length === 2;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return enableError ? callback(undefined, []) : callback([]);
      }
      result = [];
      createCallback = createArrayCallback();
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return enableError ? callback(undefined, {}) : callback({});
      }
      result = {};
      createCallback = createObjectCallback();
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return enableError ? callback(undefined, []) : callback([]);
    }
    iterate();

    function arrayIterator() {
      var value = collection[completed];
      _iterator(value, createCallback(value));
    }

    function arrayIteratorWithIndex() {
      var value = collection[completed];
      _iterator(value, completed, createCallback(value));
    }

    function objectIterator() {
      var key = keys[completed];
      var value = collection[key];
      _iterator(value, createCallback(value, key));
    }

    function objectIteratorWithKey() {
      var key = keys[completed];
      var value = collection[key];
      _iterator(value, key, createCallback(value, key));
    }

    function createArrayCallback() {
      return enableError ? arrayCallbackWithError : arrayCallback;
    }

    function createObjectCallback() {
      return enableError ? objectCallbackWithError : objectCallback;
    }

    function arrayCallback(value) {

      var called = false;

      return function(res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (!!res === bool) {
          result[++resultCount] = value;
        }
        if (++completed === size) {
          return callback(result);
        }
        iterate();
      };
    }

    function arrayCallbackWithError(value) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          callback(err, result);
          callback = noop;
          return;
        }
        if (!!res === bool) {
          result[++resultCount] = value;
        }
        if (++completed === size) {
          return callback(undefined, result);
        }
        iterate();
      };
    }

    function objectCallback(value, key) {

      var called = false;

      return function(res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (!!res === bool) {
          result[key] = value;
        }
        if (++completed === size) {
          return callback(result);
        }
        iterate();
      };
    }

    function objectCallbackWithError(value, key) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          callback(err, _objectClone(result));
          callback = noop;
          return;
        }
        if (!!res === bool) {
          result[key] = value;
        }
        if (++completed === size) {
          return callback(undefined, result);
        }
        iterate();
      };
    }
  }

  function pickLimit(collection, limit, iterator, callback, thisArg, opposite) {

    callback = callback || noop;
    if (isNaN(limit) || limit < 1) {
      return callback([]);
    }

    var size, keys, iterate, createCallback;
    var bool = !opposite;
    var result = {};
    var started = 0;
    var completed = 0;
    var enableError = callback.length === 2;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return enableError ? callback(null, []) : callback([]);
      }
      createCallback = createArrayCallback();
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return enableError ? callback(null, {}) : callback({});
      }
      createCallback = createObjectCallback();
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return enableError ? callback(null, []) : callback([]);
    }

    _times(limit > size ? size : limit, iterate);

    function arrayIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[index];
      _iterator(value, createCallback(value, index));
    }

    function arrayIteratorWithIndex() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var value = collection[index];
      _iterator(value, index, createCallback(value, index));
    }

    function objectIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      var value = collection[key];
      _iterator(value, createCallback(value, key));
    }

    function objectIteratorWithKey() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      var value = collection[key];
      _iterator(value, key, createCallback(value, key));
    }

    function createArrayCallback() {
      return enableError ? arrayCallbackWithError : arrayCallback;
    }

    function createObjectCallback() {
      return enableError ? objectCallbackWithError : objectCallback;
    }

    function arrayCallback(value, index) {

      var called = false;

      return function(res) {

        if (called) {
          throw new Error('Callback was already called.');
        }

        called = true;
        if (!!res === bool) {
          result[index + ''] = value;
        }
        if (++completed === size) {
          return callback(_toArray(result));
        }
        iterate();
      };
    }

    function arrayCallbackWithError(value, index) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }

        called = true;
        if (err) {
          callback(err, _toArray(result));
          callback = noop;
          return;
        }
        if (!!res === bool) {
          result[index + ''] = value;
        }
        if (++completed === size) {
          return callback(undefined, _toArray(result));
        }
        iterate();
      };
    }

    function objectCallback(value, key) {

      var called = false;

      return function(res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (!!res === bool) {
          result[key] = value;
        }
        if (++completed === size) {
          return callback(result);
        }
        iterate();
      };
    }

    function objectCallbackWithError(value, key) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          callback(err, _objectClone(result));
          callback = noop;
          return;
        }
        if (!!res === bool) {
          result[key] = value;
        }
        if (++completed === size) {
          return callback(undefined, result);
        }
        iterate();
      };
    }
  }

  function reduce(collection, result, iterator, callback, thisArg) {

    callback = callback || noop;
    var size, keys, iterate, called;
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback(undefined, result);
    }

    iterate(result);

    function arrayIterator(result) {
      called = false;
      var value = collection[completed];
      _iterator(result, value, done);
    }

    function arrayIteratorWithIndex(result) {
      called = false;
      var value = collection[completed];
      _iterator(result, value, completed, done);
    }

    function objectIterator(result) {
      called = false;
      var key = keys[completed];
      var value = collection[key];
      _iterator(result, value, done);
    }

    function objectIteratorWithKey(result) {
      called = false;
      var key = keys[completed];
      var value = collection[key];
      _iterator(result, value, key, done);
    }

    function done(err, result) {

      if (called) {
        throw new Error('Callback was already called.');
      }
      called = true;
      if (err) {
        return callback(err, result);
      }
      if (++completed === size) {
        return callback(undefined, result);
      }
      iterate(result);
    }

  }

  function reduceRight(collection, result, iterator, callback, thisArg) {

    callback = callback || noop;
    var size, keys, iterate, called;
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback(undefined, result);
    }

    iterate(result);

    function arrayIterator(result) {
      called = false;
      var value = collection[size - completed - 1];
      _iterator(result, value, done);
    }

    function arrayIteratorWithIndex(result) {
      called = false;
      var index = size - completed - 1;
      var value = collection[index];
      _iterator(result, value, index, done);
    }

    function objectIterator(result) {
      called = false;
      var key = keys[size - completed - 1];
      var value = collection[key];
      _iterator(result, value, done);
    }

    function objectIteratorWithKey(result) {
      called = false;
      var key = keys[size - completed - 1];
      var value = collection[key];
      _iterator(result, value, key, done);
    }

    function done(err, result) {

      if (called) {
        throw new Error('Callback was already called.');
      }
      called = true;
      if (err) {
        return callback(err, result);
      }
      if (++completed === size) {
        return callback(undefined, result);
      }
      iterate(result);
    }

  }

  function transform(collection, iterator, callback, accumulator, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done,
      result: undefined
    };
    var size, result;
    var isArray = Array.isArray(collection);
    var completed = 0;

    if (isArray) {
      size = collection.length;
      result = params.result = accumulator !== undefined ? accumulator : [];
      if (!size) {
        return callback(undefined, result);
      }
      if (iterator.length === 4) {
        _arrayTransformIteratorWithIndex(params);
      } else {
        _arrayTransformIterator(params);
      }
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      result = params.result = accumulator !== undefined ? accumulator : {};
      if (!size) {
        return callback(undefined, result);
      }
      if (iterator.length === 4) {
        _objectTransformIteratorWithKey(params);
      } else {
        _objectTransformIterator(params);
      }
    } else {
      callback(undefined, {});
    }

    function done(err, bool) {
      if (err) {
        callback(err, Array.isArray(result) ? _arrayClone(result) : _objectClone(result));
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback(undefined, result);
        callback = noop;
        return;
      }
      if (bool === false) {
        callback(undefined, Array.isArray(result) ? _arrayClone(result) : _objectClone(result));
        callback = noop;
        return;
      }
    }
  }

  function transformSeries(collection, iterator, callback, accumulator, thisArg) {

    callback = callback || noop;
    var size, iterate, called, result;
    var isArray = Array.isArray(collection);
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (isArray) {
      size = collection.length;
      result = accumulator !== undefined ? accumulator : [];
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      var keys = Object.keys(collection);
      size = keys.length;
      result = accumulator !== undefined ? accumulator : {};
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback(undefined, {});
    }

    iterate();

    function arrayIterator() {
      called = false;
      _iterator(result, collection[completed], done);
    }

    function arrayIteratorWithIndex() {
      called = false;
      _iterator(result, collection[completed], completed, done);
    }

    function objectIterator() {
      called = false;
      _iterator(result, collection[keys[completed]], done);
    }

    function objectIteratorWithKey() {
      called = false;
      var key = keys[completed];
      _iterator(result, collection[key], key, done);
    }

    function done(err, bool) {

      if (called) {
        throw new Error('Callback was already called.');
      }
      called = true;
      if (err) {
        return callback(err, result);
      }
      if (++completed === size) {
        return callback(undefined, result);
      }
      if (bool === false) {
        return callback(undefined, result);
      }
      iterate();
    }

  }

  function transformLimit(collection, limit, iterator, callback, accumulator, thisArg) {

    callback = callback || noop;
    var isArray = Array.isArray(collection);
    var result = accumulator !== undefined ? accumulator : isArray ? [] : {};
    if (isNaN(limit) || limit < 1) {
      return callback(undefined, result);
    }

    var size, iterate;
    var started = 0;
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (isArray) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      var keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback(undefined, result);
    }

    _times(limit > size ? size : limit, iterate);

    function arrayIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(result, collection[index], once(done));
    }

    function arrayIteratorWithIndex() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(result, collection[index], index, once(done));
    }

    function objectIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(result, collection[keys[index]], once(done));
    }

    function objectIteratorWithKey() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      _iterator(result, collection[key], key, once(done));
    }

    function done(err, bool) {

      if (err) {
        callback(err, isArray ? _arrayClone(result) : _objectClone(result));
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback(undefined, result);
        callback = noop;
        return;
      }
      if (bool === false) {
        callback(undefined, isArray ? _arrayClone(result) : _objectClone(result));
        callback = noop;
        return;
      }
      iterate();
    }
  }

  function createSortBy(type) {

    switch (type) {
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
      return iterator.length === 3 ? collectionIteratorWithKey : collectionIterator;

      function collectionIterator(value, callback) {

        _iterator(value, function(err, criteria) {
          if (err) {
            callback(err);
            callback = noop;
            return;
          }

          callback(undefined, {
            value: value,
            criteria: criteria
          });
        });
      }

      function collectionIteratorWithKey(value, key, callback) {

        _iterator(value, key, function(err, criteria) {
          if (err) {
            callback(err);
            callback = noop;
            return;
          }

          callback(undefined, {
            value: value,
            criteria: criteria
          });
        });
      }
    }

    function createCallback(callback) {

      return function(err, res) {
        if (err) {
          callback(err);
          callback = noop;
          return;
        }

        var result = res.sort(function(a, b) {
          return b.criteria < a.criteria;
        });

        callback(undefined, _pluck(result, 'value'));
      };
    }

  }

  function some(collection, iterator, callback, thisArg) {

    callback = callback || noop;
    detect(collection, iterator, callback.length === 2 ? doneWithError : done, thisArg);

    function done(res) {

      callback(!!res);
    }

    function doneWithError(err, res) {

      callback(err, !!res);
    }
  }

  function someSeries(collection, iterator, callback, thisArg) {

    callback = callback || noop;
    detectSeries(collection, iterator, callback.length === 2 ? doneWithError : done, thisArg);

    function done(res) {

      callback(!!res);
    }

    function doneWithError(err, res) {

      callback(err, !!res);
    }
  }

  function someLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || noop;
    detectLimit(collection, limit, iterator, callback.length === 2 ? doneWithError : done, thisArg);

    function done(res) {

      callback(!!res);
    }

    function doneWithError(err, res) {

      callback(err, !!res);
    }
  }

  function every(collection, iterator, callback, thisArg) {

    callback = callback || noop;
    detect(collection, iterator, callback.length === 2 ? doneWithError : done, thisArg, true);

    function done(res) {

      callback(!res);
    }

    function doneWithError(err, res) {

      callback(err, !res);
    }
  }

  function everySeries(collection, iterator, callback, thisArg) {

    callback = callback || noop;
    detectSeries(collection, iterator, callback.length === 2 ? doneWithError : done, thisArg, true);

    function done(res) {

      callback(!res);
    }

    function doneWithError(err, res) {

      callback(err, !res);
    }
  }

  function everyLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || noop;
    detectLimit(collection, limit, iterator, callback.length === 2 ? doneWithError : done, thisArg, true);

    function done(res) {

      callback(!res);
    }

    function doneWithError(err, res) {

      callback(err, !res);
    }
  }

  function concat(collection, iterator, callback, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done
    };
    var size;
    var result = [];
    var completed = 0;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      if (iterator.length === 3) {
        _arrayIteratorWithIndex(params);
      } else {
        _arrayIterator(params);
      }
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      if (iterator.length === 3) {
        _objectIteratorWithKey(params);
      } else {
        _objectIterator(params);
      }
    } else {
      callback(undefined, result);
    }

    function done(err, array) {
      if (array !== undefined) {
        Array.prototype.push.apply(result, Array.isArray(array) ? array : [array]);
      }
      if (err) {
        callback(err, _arrayClone(result));
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback(undefined, result);
        callback = noop;
      }
    }
  }

  function concatSeries(collection, iterator, callback, thisArg) {
    callback = callback || noop;
    var params = {
      collection: collection,
      keys: undefined,
      called: false,
      completed: 0,
      iterator: thisArg ? iterator.bind(thisArg) : iterator,
      done: done
    };
    var size, iterate;
    var result = [];

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 3 ? _arraySeriesIteratorWithIndex : _arraySeriesIterator;
    } else if (collection && typeof collection === 'object') {
      params.keys = Object.keys(collection);
      size = params.keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 3 ? _objectSeriesIteratorWithKey : _objectSeriesIterator;
    } else {
      return callback(undefined, result);
    }

    iterate(params);

    function done(err, array) {
      if (params.called) {
        throw new Error('Callback was already called.');
      }
      params.called = true;
      if (array) {
        Array.prototype.push.apply(result, Array.isArray(array) ? array : [array]);
      }
      if (err) {
        return callback(err, result);
      }
      if (++params.completed === size) {
        return callback(undefined, result);
      }
      iterate(params);
    }
  }

  function concatLimit(collection, limit, iterator, callback, thisArg) {

    callback = callback || noop;
    var result = [];
    if (isNaN(limit) || limit < 1) {
      return callback(undefined, result);
    }

    var size, iterate;
    var started = 0;
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    if (Array.isArray(collection)) {
      size = collection.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (collection && typeof collection === 'object') {
      var keys = Object.keys(collection);
      size = keys.length;
      if (!size) {
        return callback(undefined, result);
      }
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    } else {
      return callback(undefined, result);
    }

    _times(limit > size ? size : limit, iterate);

    function arrayIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(collection[index], once(done));
    }

    function arrayIteratorWithIndex() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(collection[index], index, once(done));
    }

    function objectIterator() {
      var index = started++;
      if (index >= size) {
        return;
      }
      _iterator(collection[keys[index]], once(done));
    }

    function objectIteratorWithKey() {
      var index = started++;
      if (index >= size) {
        return;
      }
      var key = keys[index];
      _iterator(collection[key], key, once(done));
    }

    function done(err, array) {

      if (array) {
        Array.prototype.push.apply(result, Array.isArray(array) ? array : [array]);
      }
      if (err) {
        callback(err, result);
        callback = noop;
        return;
      }
      if (++completed === size) {
        callback(undefined, result);
        callback = noop;
        return;
      }
      iterate();
    }

  }

  function parallel(tasks, callback, thisArg) {

    callback = callback || noop;
    var size, result;
    var completed = 0;

    if (Array.isArray(tasks)) {
      size = tasks.length;
      if (!size) {
        return callback(undefined, []);
      }
      result = Array(size);
      if (thisArg) {
        _arrayEach(tasks, function(task, index) {
          task.call(thisArg, createCallback(index));
        });
      } else {
        _arrayEach(tasks, function(task, index) {
          task(createCallback(index));
        });
      }
    } else if (tasks && typeof tasks === 'object') {
      var keys = Object.keys(tasks);
      size = keys.length;
      if (!size) {
        return callback(undefined, {});
      }
      result = {};
      if (thisArg) {
        _objectEach(tasks, function(task, key) {
          task.call(thisArg, createCallback(key));
        }, keys);
      } else {
        _objectEach(tasks, function(task, key) {
          task(createCallback(key));
        }, keys);
      }
    } else {
      callback();
    }

    function createCallback(key) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          callback(err, result);
          callback = noop;
          return;
        }
        var args = _slice(arguments, 1);
        result[key] = args.length <= 1 ? res : args;
        if (++completed === size) {
          callback(undefined, result);
          callback = noop;
        }
      };
    }
  }

  function series(tasks, callback, thisArg) {

    callback = callback || noop;
    var size, result, iterate;
    var completed = 0;

    if (Array.isArray(tasks)) {
      size = tasks.length;
      if (!size) {
        return callback(undefined, []);
      }
      result = Array(size);
      if (thisArg) {
        iterate = function() {
          tasks[completed].call(thisArg, createCallback(completed));
        };
      } else {
        iterate = function() {
          tasks[completed](createCallback(completed));
        };
      }
    } else if (tasks && typeof tasks === 'object') {
      var keys = Object.keys(tasks);
      size = keys.length;
      if (!size) {
        return callback(undefined, {});
      }
      result = {};
      if (thisArg) {
        iterate = function() {
          var key = keys[completed];
          tasks[key].call(thisArg, createCallback(key));
        };
      } else {
        iterate = function() {
          var key = keys[completed];
          tasks[key](createCallback(key));
        };
      }
    } else {
      return callback();
    }
    iterate();

    function createCallback(key) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          return callback(err, result);
        }
        var args = _slice(arguments, 1);
        result[key] = args.length <= 1 ? res : args;
        if (++completed === size) {
          return callback(undefined, result);
        }
        iterate();
      };
    }
  }

  function parallelLimit(tasks, limit, callback, thisArg) {

    callback = callback || noop;
    var size, result, iterate;
    var started = 0;
    var completed = 0;

    if (Array.isArray(tasks)) {
      size = tasks.length;
      if (!size) {
        return callback(undefined, []);
      }
      result = Array(size);
      if (thisArg) {
        iterate = function() {
          var index = started++;
          if (index >= size) {
            return;
          }
          tasks[index].call(thisArg, createCallback(index));
        };
      } else {
        iterate = function() {
          var index = started++;
          if (index >= size) {
            return;
          }
          tasks[index](createCallback(index));
        };
      }
    } else if (tasks && typeof tasks === 'object') {
      var keys = Object.keys(tasks);
      size = keys.length;
      if (!size) {
        return callback(undefined, {});
      }
      result = {};
      if (thisArg) {
        iterate = function() {
          var index = started++;
          if (index >= size) {
            return;
          }
          var key = keys[index];
          tasks[key].call(thisArg, createCallback(key));
        };
      } else {
        iterate = function() {
          var index = started++;
          if (index >= size) {
            return;
          }
          var key = keys[index];
          tasks[key](createCallback(key));
        };
      }
    } else {
      return callback();
    }

    _times(limit > size ? size : limit, iterate);

    function createCallback(key) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        if (err) {
          callback(err, result);
          callback = noop;
          return;
        }
        var args = _slice(arguments, 1);
        result[key] = args.length <= 1 ? res : args;
        if (++completed === size) {
          return callback(undefined, result);
        }
        iterate();
      };
    }
  }

  function waterfall(tasks, callback) {

    callback = callback || noop;

    if (!Array.isArray(tasks)) {
      var err = new Error('First argument to waterfall must be an array of functions');
      return callback(err);
    }

    var size = tasks.length;
    if (!size) {
      return callback();
    }
    iterate(0, []);

    function iterate(completed, args) {

      var func = tasks[completed++];
      switch (args.length) {
        case 0:
          return func(done);
        case 1:
          return func(args[0], done);
        case 2:
          return func(args[0], args[1], done);
        case 3:
          return func(args[0], args[1], args[2], done);
        case 4:
          return func(args[0], args[1], args[2], args[3], done);
        case 5:
          return func(args[0], args[1], args[2], args[3], args[4], done);
        default:
          args.push(done);
          return func.apply(null, args);
      }

      function done(err) {
        if (err) {
          return callback(err);
        }
        var _args = _slice(arguments, 1);
        if (completed === size) {
          _args.unshift(undefined);
          return callback.apply(null, _args);
        }
        async.nextTick(function() {
          iterate(completed, _args);
        });
      }
    }
  }

  function whilst(test, iterator, callback, thisArg) {

    callback = callback || noop;
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

    callback = callback || noop;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    iterate();

    function iterate() {

      _iterator(function(err) {
        if (err) {
          return callback(err);
        }
        var args = _slice(arguments, 1);
        if (test.apply(thisArg, args)) {
          iterate();
        } else {
          callback();
        }
      });
    }
  }

  function until(test, iterator, callback, thisArg) {

    callback = callback || noop;
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

    callback = callback || noop;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    iterate();

    function iterate() {

      _iterator(function(err) {
        if (err) {
          return callback(err);
        }
        var args = _slice(arguments, 1);
        if (!test.apply(thisArg, args)) {
          iterate();
        } else {
          callback();
        }
      });
    }
  }

  function forever(iterator, callback, thisArg) {

    callback = callback || noop;
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

    return seq.apply(null, _reverse(arguments));
  }

  function seq( /* functions... */ ) {

    var fns = arguments;

    return function() {

      var self = this;
      var args = _baseSlice(arguments);
      var callback = args.pop();

      reduce(fns, args, iterator, done);

      function iterator(newargs, fn, callback) {

        var func = function(err) {
          var nextargs = _slice(arguments, 1);
          callback(err, nextargs);
        };
        newargs.push(func);
        fn.apply(self, newargs);
      }

      function done(err, res) {
        res = Array.isArray(res) ? res : [res];
        res.unshift(err);
        callback.apply(self, res);
      }
    };

  }

  function createApplyEach(type) {

    var func = type === 'series' ? eachSeries : each;

    return function applyEach(fns /* arguments */ ) {

      var go = function() {
        var self = this;
        var args = _baseSlice(arguments);
        var callback = args.pop() || noop;
        return func(fns, iterator, callback);

        function iterator(fn, done) {
          fn.apply(self, args.concat(done));
        }
      };
      if (arguments.length > 1) {
        var args = _slice(arguments, 1);
        return go.apply(this, args);
      } else {
        return go;
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
      var _tasks = Array.isArray(tasks) ? tasks : [tasks];

      if (!tasks || !_tasks.length) {
        if (q.idle()) {
          async.nextTick(function() {
            if (typeof q.drain === 'function') {
              q.drain();
            }
          });
        }
        return;
      }

      callback = typeof callback === 'function' ? callback : null;
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
        if (typeof q.saturated === 'function' && q.length() === q.concurrency) {
          q.saturated();
        }
        async.nextTick(q.process);
      });
    }

  }

  function priorityQueue(worker, concurrency, thisArg) {

    concurrency = concurrency || 1;

    var q = {
      tasks: [],
      concurrency: concurrency,
      saturated: noop,
      empty: noop,
      drain: noop,
      started: false,
      paused: false,
      push: push,
      kill: kill,
      process: run,
      length: getLength,
      running: running,
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
      var _tasks = Array.isArray(tasks) ? tasks : [tasks];

      if (!tasks || !_tasks.length) {
        if (q.idle()) {
          async.nextTick(function() {
            if (typeof q.drain === 'function') {
              q.drain();
            }
          });
        }
        return;
      }

      callback = typeof callback === 'function' ? callback : noop;
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

        if (typeof q.saturated === 'function' && q.length() === q.concurrency) {
          q.saturated();
        }
        async.nextTick(q.process);
      });
    }

    function push(tasks, priority, callback) {

      _insert(tasks, priority, callback);
    }

    function kill() {

      q.drain = noop;
      q.tasks = [];
    }

    function run() {

      if (q.paused || workers >= q.concurrency || !q.length()) {
        return;
      }
      var task = q.tasks.shift();
      if (typeof q.empty === 'function' && !q.length()) {
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
        if (typeof q.drain === 'function' && q.idle()) {
          q.drain();
        }

        q.process();
      }
    }

    function getLength() {

      return q.tasks.length;
    }

    function running() {

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
      saturated: noop,
      empty: noop,
      drain: noop,
      drained: true,
      push: push,
      process: run,
      length: getLength,
      running: running
    };

    var working = false;

    return c;

    function push(data, callback) {

      data = Array.isArray(data) ? data : [data];
      callback = typeof callback === 'function' ? callback : noop;

      _arrayEach(data, function(task) {

        c.tasks.push({
          data: task,
          callback: callback
        });
        c.drained = false;

        if (typeof c.saturated === 'function' && c.length() === c.payload) {
          c.saturated();
        }
      });

      async.nextTick(c.process);
    }

    function run() {

      if (working) {
        return;
      }
      if (!c.length()) {
        if (typeof c.drain === 'function' && !c.drained) {
          c.drain();
        }
        c.drained = true;
        return;
      }

      var tasks = typeof c.payload === 'number' ? c.tasks.splice(0, payload) : c.tasks;
      var data = _pluck(tasks, 'data');

      if (!c.length() && typeof c.empty === 'function') {
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

    function running() {

      return working;
    }

  }

  function auto(tasks, callback) {

    callback = callback ? once(callback) : noop;
    var keys = Object.keys(tasks);
    var remainingTasks = keys.length;
    if (!remainingTasks) {
      return callback();
    }

    var listeners = [];
    var results = {};

    addListener(function() {
      if (!remainingTasks) {
        callback(undefined, results);
      }
    });

    _objectEach(tasks, function(task, key) {

      task = Array.isArray(task) ? task : [task];
      var size = task.length;
      var requires = task.slice(0, size - 1);
      var _task = task[size - 1];

      if (ready()) {
        return _task(done, results);
      }

      addListener(listener);

      function done(err) {

        var args = _slice(arguments, 1);
        if (args.length <= 1) {
          args = args[0];
        }

        if (err) {
          var safeResults = _objectClone(results);
          safeResults[key] = args;
          callback(err, safeResults);
          callback = noop;
          return;
        }

        results[key] = args;
        async.nextTick(taskComplete);
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
    if (typeof limit === 'function') {
      callback = task;
      task = limit;
      limit = DEFAULT_TIMES;
    }

    limit = parseInt(limit, 10) || DEFAULT_TIMES;

    return typeof callback === 'function' ? wrappedTask() : wrappedTask;

    function wrappedTask(wrappedCallback, wrappedResults) {

      callback = wrappedCallback || callback || noop;

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
    var keys = [];
    if (Array.isArray(tasks)) {
      size = tasks.length;
    } else {
      keys = Object.keys(tasks);
      size = keys.length;
    }
    return makeCallback(0);

    function makeCallback(index) {

      var fn = function() {
        if (size) {
          var key = keys[index] || index;
          tasks[key].apply(null, arguments);
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

    var args = _slice(arguments, 1);

    return function() {
      return func.apply(this, Array.prototype.concat.apply(args, _baseSlice(arguments)));
    };
  }

  function times(n, iterator, callback, thisArg) {

    callback = callback || noop;
    if (!Number.isFinite(n) || n < 1) {
      return callback(undefined, []);
    }
    var result = Array(n);
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    _times(n, function(num) {
      _iterator(num, createCallback(num));
    });

    function createCallback(index) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        result[index] = res;
        if (err) {
          callback(err);
          callback = noop;
          return;
        }
        if (++completed === n) {
          callback(undefined, result);
          callback = noop;
        }
      };
    }

  }

  function timesSeries(n, iterator, callback, thisArg) {

    callback = callback || noop;
    if (!Number.isFinite(n) || n < 1) {
      return callback(undefined, []);
    }
    var result = Array(n);
    var completed = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;
    var iterate = function() {
      _iterator(completed, createCallback(completed));
    };

    iterate();

    function createCallback(index) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        result[index] = res;

        if (err) {
          return callback(err);
        }
        if (++completed === n) {
          return callback(undefined, result);
        }
        iterate();
      };
    }

  }

  function timesLimit(n, limit, iterator, callback, thisArg) {

    callback = callback || noop;
    if (!Number.isFinite(n) || n < 1) {
      return callback(undefined, []);
    }
    var result = Array(n);
    var completed = 0;
    var beforeCompleted = 0;
    var _iterator = thisArg ? iterator.bind(thisArg) : iterator;

    limit = limit > n ? n : limit;
    var iterate = function() {
      _times(limit, function(num) {
        var index = beforeCompleted + num;
        if (index >= n) {
          return;
        }
        _iterator(index, createCallback(index));
      });
    };
    iterate();

    function createCallback(index) {

      var called = false;

      return function(err, res) {

        if (called) {
          throw new Error('Callback was already called.');
        }
        called = true;
        result[index] = res;

        if (err) {
          callback(err);
          callback = noop;
          return;
        }
        if (++completed === n) {
          callback(undefined, result);
          callback = noop;
          return;
        }
        if (completed >= beforeCompleted + limit) {
          beforeCompleted = completed;
          iterate();
        }
      };
    }

  }

  function memoize(fn, hasher, thisArg) {

    hasher = hasher || function(hash) {
      return hash;
    };

    var memo = {};
    var queues = {};
    var memoized = function() {

      var args = _baseSlice(arguments);
      var callback = args.pop();
      var key = hasher.apply(null, args);
      if (_has(memo, key)) {
        async.nextTick(function() {
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

        var args = _baseSlice(arguments);
        memo[key] = args;
        var q = queues[key];
        delete queues[key];

        var i = -1;
        var length = q.length;
        while (++i < length) {
          q[i].apply(thisArg, args);
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

      var args = _slice(arguments, 1);
      args.push(done);
      fn.apply(null, args);
    };

    function done(err) {

      if (objectTypes[typeof console]) {
        if (err) {
          if (console.error) {
            console.error(err);
          }
          return;
        }

        if (console[name]) {
          var args = _slice(arguments, 1);
          _arrayEach(args, function(arg) {
            console[name](arg);
          });
        }
      }
    }
  }

  function noConflict() {

    root.async = previos_async;
    return async;
  }

  function EventEmitter(emitter, limit) {

    this._emitter = emitter || series;
    this._limit = limit || 4;
    this._events = {};
    this._once = [];
  }

  EventEmitter.prototype.on = function on(key, callback) {

    var self = this;
    if (typeof key === 'object') {
      _objectEach(key, function(func, key) {
        on.call(self, key, func);
      });
    } else {
      self._events[key] = self._events[key] || [];
      if (Array.isArray(callback)) {
        Array.prototype.push.apply(self._events[key], callback);
      } else {
        self._events[key].push(callback);
      }
    }
    return self;
  };

  EventEmitter.prototype.once = function once(key, callback) {

    var self = this;
    if (typeof key === 'object') {
      _objectEach(key, function(func, key) {
        once.call(self, key, func);
      });
    } else {
      if (Array.isArray(callback)) {
        Array.prototype.push.apply(self._once, callback);
      } else {
        self._once.push(callback);
      }
      self.on(key, callback);
    }
    return self;
  };

  EventEmitter.prototype.emit = function(key, callback, thisArg) {

    callback = callback || noop;
    var self = this;
    var events = self._events[key] || [];
    if (!events.length) {
      return callback();
    }

    var emitter = self._emitter;
    emitter = thisArg ? emitter.bind(thisArg) : emitter;
    if (emitter === parallelLimit) {
      emitter(events, self._limit, done);
    } else {
      emitter(events, done);
    }
    return self;

    function done(err, res) {

      _arrayEach(self._once, function(func) {
        var index = _indexOf(events, func);
        if (0 <= index) {
          events.splice(index, 1);
        }
      });
      self._once = [];
      callback(err, res);
    }
  };

  /**
   * @param {Object} option
   * @param {Boolean} option.series - default
   * @param {Boolean} option.parallel
   * @param {Boolean} option.parallelLimit
   * @param {Number} option.limit - default 4
   */
  function eventEmitter(option) {

    option = option || {};
    var limit = option.limit;
    if (option.parallel && !limit) {
      return new EventEmitter(parallel);
    }
    if (option.parallel || option.parallelLimit) {
      return new EventEmitter(parallelLimit, limit);
    }

    return new EventEmitter(option.emitter);
  }

}.call(this));
