/* global it */

define = function() {};

var fs = require('fs');
var vm = require('vm');
var path = require('path');

var _ = require('lodash');
var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var asyncPath = global.async_path || path.resolve(__dirname, '../../lib/async.js');

parallel('#define', function() {

  'use strict';

  it('should check define', function(done) {

    var context = {
      define: function(array, callback) {
        assert.deepEqual(array, []);
        var _async = callback();
        assert.deepEqual(_.keys(async), _.keys(_async));
        done();
      },
      console: console,
      require: require,
      exports: exports,
      module: module
    };
    context.define.amd = true;
    vm.runInNewContext(fs.readFileSync(asyncPath), context);
  });

  it('should check for coverage', function(done) {

    define = function(array, callback) {
      assert.deepEqual(array, []);
      var _async = callback();
      assert.deepEqual(_.keys(async), _.keys(_async));
      done();
    };
    define.amd = true;
    delete(require.cache[asyncPath]);
    require(asyncPath);
    define = null;
  });
});

parallel('#nextTick', function() {

  'use strict';

  it('should assign setImmediate when process does not exist', function(done) {

    var context = {
      require: require,
      console: console,
      exports: exports,
      setTimeout: setTimeout,
      setImmediate: setImmediate
    };
    vm.runInNewContext(fs.readFileSync(asyncPath), context);
    assert.strictEqual(typeof context.async.nextTick, 'function');
    assert.notStrictEqual(context.async.nextTick, process.nextTick);
    assert.strictEqual(context.async.nextTick, setImmediate);
    context.async.nextTick(done);
  });

  it('should assign setImmediate when process does not exist for coverage', function(done) {

    var _nextTick = process.nextTick;
    process.nextTick = undefined;
    delete(require.cache[asyncPath]);
    var async = require(asyncPath);
    process.nextTick = _nextTick;
    assert.strictEqual(typeof async.nextTick, 'function');
    assert.notStrictEqual(async.nextTick, process.nextTick);
    assert.strictEqual(async.nextTick, setImmediate);
    async.nextTick(done);
  });

  it('should create original nextTick when process does not have nextTick and setImmediate', function(done) {

    var context = {
      require: require,
      console: console,
      exports: exports,
      setTimeout: setTimeout
    };
    vm.runInNewContext(fs.readFileSync(asyncPath), context);
    assert.strictEqual(typeof context.async.nextTick, 'function');
    assert.notStrictEqual(context.async.nextTick, process.nextTick);
    context.async.nextTick(done);
  });

  it('should create original nextTick when process does not have nextTick and setImmediate for coverage', function(done) {

    var _nextTick = process.nextTick;
    var _setImmediate = setImmediate;
    process.nextTick = undefined;
    setImmediate = undefined;
    delete(require.cache[asyncPath]);
    var async = require(asyncPath);
    process.nextTick = _nextTick;
    setImmediate = _setImmediate;
    assert.strictEqual(typeof async.nextTick, 'function');
    assert.notStrictEqual(async.nextTick, process.nextTick);
    async.nextTick(done);
  });

  it('should avoid node warning [v0.10.x only]', function(done) {

    var array = _.times(10000);
    var iterator = function(n, done) {
      done();
    };
    async.eachSeries(array, iterator, done);
  });

  it('should pass extra arguments', function(done) {

    async.nextTick(function(a, b, c, d) {
      assert.strictEqual(a, 1);
      assert.strictEqual(b, 2);
      assert.strictEqual(c, 3);
      assert.strictEqual(d, undefined);
      done();
    }, 1, 2, 3);
  });
});

parallel('#setImmediate', function() {

  'use strict';

  it('should create original setImmediate if does not have setImmediate', function(done) {

    var context = {
      require: require,
      console: console,
      exports: exports,
      setTimeout: setTimeout
    };
    vm.runInNewContext(fs.readFileSync(asyncPath), context);
    assert.strictEqual(typeof context.async.nextTick, 'function');
    assert.notStrictEqual(context.async.nextTick, process.nextTick);
    context.async.nextTick(done);
  });

  it('should create original setImmediate if does not have setImmediate for coverage', function(done) {

    var _setImmediate = setImmediate;
    setImmediate = undefined;
    delete(require.cache[asyncPath]);
    var async = require(asyncPath);
    setImmediate = _setImmediate;
    assert.strictEqual(typeof async.setImmediate, 'function');
    assert.notStrictEqual(async.setImmediate, process.nextTick);
    async.nextTick(done);
  });

  it('should pass extra arguments', function(done) {

    var _setImmediate = setImmediate;
    setImmediate = undefined;
    delete(require.cache[asyncPath]);
    var async = require(asyncPath);
    setImmediate = _setImmediate;
    async.setImmediate(function(a, b, c, d) {
      assert.strictEqual(a, 1);
      assert.strictEqual(b, 2);
      assert.strictEqual(c, 3);
      assert.strictEqual(d, undefined);
      done();
    }, 1, 2, 3);
  });
});

parallel('#check functions', function() {

  'use strict';

  it('should have async functions', function() {
    _.forOwn(require('async'), function(func, key) {
      assert.ok(async[key], key + ' wasn\'t found.');
    });
  });
});

parallel('#other', function() {

  'use strict';

  var path = require('path');

  it('should check whether "async" is assigned to context', function() {

    var context = {
      require: require,
      console: console,
      exports: exports
    };
    vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../lib/async.js')), context);
    assert.ok(context.async);
    _.forOwn(context.async, function(func, key) {
      assert.ok(async[key]);
    });
  });

  it('should check whether "neo_async" is assigned to context', function() {

    var context = {
      require: require,
      console: console,
      exports: exports,
      async: require('async')
    };
    vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../lib/async.js')), context);
    assert.ok(context.neo_async);
    _.forOwn(context.neo_async, function(func, key) {
      assert.ok(async[key]);
    });
  });
});

parallel('#default', function() {

  'use strict';

  it('should have same functions', function() {

    _.forOwn(async['default'], function(value, key) {
      assert.ok(async[key], key + ' wasn\'t found.');
    });
  });
});
