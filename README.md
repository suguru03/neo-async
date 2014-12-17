# Neo-Async
[![Build Status](https://travis-ci.org/suguru03/Neo-Async.svg?branch=master)](https://travis-ci.org/suguru03/Neo-Async)
[![Coverage Status](https://coveralls.io/repos/suguru03/Neo-Async/badge.png?branch=master)](https://coveralls.io/r/suguru03/Neo-Async?branch=master)

Neo-Async is compatible with Async.js, it is faster and has more feature.
Async is a utilty module which provides staright-forward.

## Installation

### In a browser
```html
<script src="async.min.js"></script>
```

### In an AMD loader
```js
require(['async.min'], function(async) {});
```

### Node.js

#### standard

```bash
$ npm install neo-async
```
```js
var async = require('neo-async');
```

#### replacement
```bash
$ npm install neo-async
$ ln -s ./node_modules/neo-async ./node_modules/async
```
```js
var async = require('async');
```
## Feature

### Collections

* .each [Series, Limit]
* async.map [Series, Limit]
* async.filter [Series, Limit]
* async.reject [Series, Limit]
* async.detect [Series, Limit]
* async.pick [Series, Limit]
* async.transform [Series, Limit]
* async.reduce
* async.reduceRight
* async.sortBy [Series, Limit]
* async.some [Series, Limit]
* async.every [Series, Limit]
* async.concat [Series, Limit]
* [`multiEach`](#multEach)

### Control Flow

* async.series
* async.parallel [Limit]
* async.waterfall
* async.whilst
* async.doWhilst
* async.until
* async.doUntil
* async.forever
* async.seq
* async.applyEach [Series]
* async.queue
* async.priorityQueue
* async.cargo
* async.auto
* async.retry
* async.iterator
* async.nextTick
* async.setImmediate
* async.times [Series, Limit]

### Utils

* async.memoize
* async.unmemoize
* async.log
* async.dir
* async.noConflict

<a name="multiEach" />
### multiEach (collection, tasks, callback)
This function provides asynchronous and straight-forward to deep nested each functions.

#### synchronous

```js
vvar order = [];
var array = [1, 2, 3];
var tasks = [
  function(num, index, callback) {
    order.push(num);
    callback(null, array);
  },
  function(num, index, callback) {
    order.push(num);
    callback(null, array);
  },
  function(num, index, callback) {
    order.push(num);
    callback(null, array);
  },
  function(num, index, callback) {
    order.push(num);
    callback();
  }
];

// get same result
var _order = [];
array.forEach(function(num) {
  _order.push(num);
  array.forEach(function(num) {
    _order.push(num);
    array.forEach(function(num) {
      _order.push(num);
      array.forEach(function(num) {
        _order.push(num);
      });
    });
  });
});

async.multiEach(array, tasks, function(err) {
  assert.deepEqual(order, _order);
});

```

#### asynchronous

```js
var order = [];
var array = [1, 2, 3];
var collection = {
  a: [array, array],
  b: {
    c: array,
    d: array
  }
};
var delay = [25, 10];
var tasks = [
  function(collection, key, callback) {
    setTimeout(function() {
      callback(null, array);
    }, delay.shift());
  },
  function(collection, key, callback) {
    callback(null, array);
  },
  function(value, key, callback) {
    setTimeout(function() {
      order.push(value);
      callback();
    }, value * 10);
  }
];

async.multiEach(collection, tasks, function(err) {
  assert.deepEqual(order, [
    1, 1, 1,
    2, 2, 2,
    1, 1, 1,
    3, 3, 3,
    2, 2, 2,
    3, 3, 3
  ]);
});
```

## Speed Comparison

* Compare Async with Neo-Async
* Use [func-comparator](https://github.com/suguru03/func-comparator "func-comparator")


### sample script

#### sample.waterfall.js

```js
'use strict';
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async = require('neo-async');

// roop count
var count = 10;
// sampling times
var times = 10000;
var array = _.sample(_.times(count), count);
var tasks = _.map(array, function(n, i) {
  if (i === 0) {
    return function(next) {
      next(null, n);
    };
  }
  return function(total, next) {
    next(null, total + n);
  };
});
var funcs = {
  'async': function(callback) {
    async.waterfall(tasks, callback);
  },
  'neo-async': function(callback) {
    neo_async.waterfall(tasks, callback);
  }
};

comparator
.set(funcs)
.option({
  async: true,
  times: times
})
.start()
.result(function(err, res) {
  console.log(res);
});
```

#### execute

```bash
$ node --stack-size=65536 speed_test/sample.waterfall.js
```

#### result

```js
{ async:
   { min: 47.16, // [μs]
     max: 7957.74,
     average: 69.31,
     variance: 31939.14,
     standard_deviation: 178.71,
     vs: { 'neo-async': 12.03 } }, // [%] 100 * neo_async.average / async.average
  'neo-async':
   { min: 3.2,
     max: 7296.46,
     average: 8.34,
     variance: 11866,
     standard_deviation: 108.93,
     vs: { async: 831.05 } } }
```

### Results

* waterfall
  * vs: { async: 831.05 }
* parallel
  * vs: { async: 209.96 }
* parallelLimit
  * vs: { async: 171.77 }
* concat
  * vs: { async: 289.67 }
* series
  * vs: { async: 52.14 } ~ vs: { async: 779.62 }
  * unstable: because sample is less.
