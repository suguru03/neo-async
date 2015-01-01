# Neo-Async
[![Build Status](https://travis-ci.org/suguru03/neo-async.svg?branch=master)](https://travis-ci.org/suguru03/Neo-Async)
[![codecov.io](https://codecov.io/github/suguru03/neo-async/coverage.svg?branch=master)](https://codecov.io/github/suguru03/neo-async?branch=master)

![Neo-Async](https://raw.githubusercontent.com/wiki/suguru03/neo-async/images/neo_async.png)

![nodei](https://nodei.co/npm/neo-async.png?downloads=true&downloadRank=true)

Neo-Async is compatible with Async.js, it is faster and has more feature.
Async is a utilty module which provides staright-forward.

---

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

---

## Feature

### Collections

* [`concat`](#concat)
* [`concatSeries`](#concatSeries)
* [`concatLimit`](#concatLimit)
* [`detect`](#detect)
* [`detectSeries`](#detectSeries)
* [`detectLimit`](#detectLimit)
* [`each`](#each)
* [`eachSeries`](#eachSeries)
* [`eachLimit`](#eachLimit)
* [`every`](#every)
* [`everySeries`](#everySeries)
* [`everyLimit`](#everyLimit)
* [`filter`](#filter)
* [`filterSeries`](#filterSeries)
* [`filterLimit`](#filterLimit)
* [`forEach`](#each)
* [`forEachSeries`](#eachSeries)
* [`forEachLimit`](#eachLimit)
* [`map`](#map)
* [`mapSeries`](#mapSeries)
* [`mapLimit`](#mapLimit)
* [`multiEach`](#multiEach)
* [`pick`](#pick)
* [`pickSeries`](#pickSeries)
* [`pickLimit`](#pickLimit)
* [`reduce`](#reduce)
* [`reduceRight`](#reduceRight)
* [`reject`](#reject)
* [`rejectSeries`](#rejectSeries)
* [`rejectLimit`](#rejectLimit)
* [`select`](#filter)
* [`selectSeries`](#filterSeries)
* [`selectLimit`](#filterLimit)
* [`some`](#some)
* [`someSeries`](#someSeries)
* [`someLimit`](#someLimit)
* [`sortBy`](#sortBy)
* [`sortBySeries`](#sortBySeries)
* [`sortByLimit`](#sortByLimit)
* [`transform`](#transform)
* [`transformSeries`](#transformSeries)
* [`transformLimit`](#transformLimit)

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
* async.eventEmitter
* async.EventEmitter

---

<a name='concat'/>
### concat(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(err, res) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(null, num);
  }, num * 10);
};
async.concat(collection, iterator, function(err, res) {
  assert.deepEqual(res, [1, 2, 3]);
  assert.deepEqual(order, [1, 2, 3]);
});

```

---

<a name='concatSeries'/>
### concatSeries(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(err, res) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(null, num);
  }, num * 10);
};
async.concatSeries(collection, iterator, function(err, res) {
  assert.deepEqual(res, [1, 3, 2]);
  assert.deepEqual(order, [1, 3, 2]);
});

```

---
<a name='concatLimit'/>
### concatLimit(collection, limit, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. limit (Number): The maximum number of iterators to run at any time.
3. iterator(item, callback) (Function): The function called per iteration.
4. callback(err, res) (Function): The function called at the end.
5. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(null, num);
  }, num * 10);
};
async.concatLimit(collection, 2, iterator, function(err, res) {
  assert.deepEqual(res, [1, 3, 2]);
  assert.deepEqual(order, [1, 3, 2]);
});

```

---

<a name='detect'/>
### detect(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(res) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(num === 3);
  }, num * 10);
};
async.detect(collection, iterator, function(res) {
  assert.deepEqual(res, 3);
  assert.deepEqual(order, [1, 2, 3]);
});

```

---

<a name='detectSeries'/>
### detectSeries(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(res) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(num === 3);
  }, num * 10);
};
async.detectSeries(collection, iterator, function(res) {
  assert.deepEqual(res, 3);
  assert.deepEqual(order, [1, 3]);
});

```

---

<a name='detectLimit'/>
### detectLimit(collection, limit, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. limit (Number): The maximum number of iterators to run at any time.
3. iterator(item, callback) (Function): The function called per iteration.
4. callback(res) (Function): The function called at the end.
5. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(num === 3);
  }, num * 10);
};
async.detectLimit(collection, 2, iterator, function(res) {
  assert.deepEqual(res, 3);
  assert.deepEqual(order, [1, 3]);
});

```
---

<a name='each'/>
### each(collection, iterator, callback, thisArg)
Applies the function iterator to each item in collection, in parallel.

__Aliases__

async.forEach

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(err) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done();
  }, num * 10);
};
async.each(collection, iterator, function(err) {
  assert.deepEqual(order, [1, 2, 3]);
});
```

---

<a name='eachSeries'/>
### eachSeries(collection, iterator, callback, thisArg)
The same as each, in series.

__Aliases__

async.forEachSeries

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(err) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done();
  }, num * 10);
};
async.eachSeries(collection, iterator, function(err) {
  assert.deepEqual(order, [1, 3, 2]);
});
```

---

<a name='eachLimit'/>
### eachLimit(collection, limit, iterator, callback, thisArg)
The same as each, in limited parallel.

__Aliases__

async.forEachLimit

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. limit (Number): The maximum number of iterators to run at any time.
3. iterator(item, callback) (Function): The function called per iteration.
4. callback(err) (Function): The function called at the end.
5. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done();
  }, num * 10);
};
async.eachLimit(collection, 2, iterator, function(err) {
  assert.deepEqual(order, [1, 3, 2]);
});
```
---

<a name='every'/>
### every(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(bool) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2, 4];
var iterator = function(num, callback) {
  setTimeout(function() {
    order.push(num);
    callback(num % 2);
  }, num * 10);
};
async.every(collection, iterator, function(res) {
  assert.strictEqual(res, false);
  assert.deepEqual(order, [1, 2]);
  done();
});

```

---

<a name='everySeries'/>
### everySeries(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(bool) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2, 4];
var iterator = function(num, callback) {
  setTimeout(function() {
    order.push(num);
    callback(num % 2);
  }, num * 10);
};
async.everySeries(collection, iterator, function(res) {
  assert.strictEqual(res, false);
  assert.deepEqual(order, [1, 3, 2]);
  done();
});

```

---

<a name='everyLimit'/>
### everyLimit(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(bool) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var limit = 2;
var order = [];
var collection = [1, 3, 2, 4];
var iterator = function(num, callback) {
  setTimeout(function() {
    order.push(num);
    callback(num % 2);
  }, num * 10);
};
async.everyLimit(collection, limit, iterator, function(res) {
  assert.strictEqual(res, false);
  assert.deepEqual(order, [1, 3, 2]);
  done();
});

```

---

<a name='filter'/>
### filter(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(array) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [3, 1, 2, 4];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(num % 2);
  }, num * 10);
};
async.filter(collection, iterator, function(res) {
  assert.deepEqual(res, [3, 1]);
  assert.deepEqual(order, [1, 2, 3, 4]);
});
```
---

<a name='filterSeries'/>
### filterSeries(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(array) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [3, 1, 2, 4];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(num % 2);
  }, num * 10);
};
async.filterSeries(collection, iterator, function(res) {
  assert.deepEqual(res, [3, 1]);
  assert.deepEqual(order, [3, 1, 2, 4]);
});
```
----

<a name='filterLimit'/>
### filterLimit(collection, limit, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. limit (Number): The maximum number of iterators to run at any time.
3. iterator(item, callback) (Function): The function called per iteration.
4. callback(res) (Function): The function called at the end.
5. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [3, 1, 2, 4];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(num % 2);
  }, num * 10);
};
async.filterLimit(collection, 2, iterator, function(res) {
  assert.deepEqual(res, [3, 1]);
  assert.deepEqual(order, [1, 3, 2, 4]);
});
```

---

<a name='map'/>
### map(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(err, array) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(null, num);
  }, num * 10);
};
async.map(collection, iterator, function(err, array) {
  assert.deepEqual(array, [1, 3, 2]);
  assert.deepEqual(order, [1, 2, 3]);
});
```

---

<a name='mapSeries'/>
### eachSeries(collection, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. iterator(item, callback) (Function): The function called per iteration.
3. callback(err, array) (Function): The function called at the end.
4. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(null, num);
  }, num * 10);
};
async.mapSeries(collection, iterator, function(err, array) {
  assert.deepEqual(array, [1, 3, 2]);
  assert.deepEqual(order, [1, 3, 2]);
});

```

---

<a name='mapLimit'/>
### mapLimit(collection, limit, iterator, callback, thisArg)

__Arguments__

1. collection (Array|Object): The collection to iterate over.
2. limit (Number): The maximum number of iterators to run at any time.
3. iterator(item, callback) (Function): The function called per iteration.
4. callback(err, array) (Function): The function called at the end.
5. thisArg (*): The this binding of iterator.

```js
var order = [];
var collection = [1, 3, 2];
var iterator = function(num, done) {
  setTimeout(function() {
    order.push(num);
    done(null, num);
  }, num * 10);
};
async.mapLimit(collection, 2, iterator, function(err, array) {
  assert.deepEqual(array, [1, 3, 2]);
  assert.deepEqual(order, [1, 3, 2]);
});
```

---

<a name='multiEach'/>
### multiEach(collection, tasks, callback)
This function provides asynchronous and straight-forward to deep nested each functions, in parallel.

__Arguments__

1. collection (Array|Object): The collection to iterate over to tasks.
2. tasks (Function[]): The function called in task order.
3. callback(err) (Function): The function called at the end.

__synchronous__

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

__asynchronous__

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
---

## Speed Comparison

* Compare Async with Neo-Async
* Use [func-comparator](https://github.com/suguru03/func-comparator "func-comparator")
* node v0.10.33
* async v0.9.0
* neo-async v0.3.1

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
var times = 1000;
var array = _.shuffle(_.times(count));
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

__execute__

```bash
# using garbage collection per execute
$ node --exsepo_gc speed_test/controlFlow/sample.waterfall.js
```

__result__

```js
{ async:
   { min: 91.79,
     max: 1751.06,
     average: 275.01,
     variance: 55185.67,
     standard_deviation: 234.91,
     vs: { 'neo-async': 41 } }, //[%] 100 * neo_async.average / async.average
  'neo-async':
   { min: 16.55,
     max: 600.16,
     average: 112.78,
     variance: 11310.35,
     standard_deviation: 106.35,
     vs: { async: 243.84 } } }
```

### Results

__Collections__

|function|count|times|async/neo-async|
|---|---|---|---|
|concat|10|1000|125.77|
|concatSeries|10|1000|101.81|
|detect|10|1000|282.77|
|detectSeries|10|1000|112.06|
|each|10|1000|111.66|
|eachSeries|10|1000|94.08|
|eachLimit|10|1000|154.82|
|every|10|1000|217.7|
|filter|10|1000|279.27|
|filterSeries|10|1000|242.97|
|map|10|1000|473.08|
|mapSeries|10|1000|359.44|
|mapLimit|10|1000|590.42|
|reduce|10|1000|102.36|
|reduceRight|10|1000|341.52|
|some|10|1000|266.78|
|sortBy|10|1000|135.18|

__ControlFlow__

|function|count|times|async/neo-async|
|---|---|---|---|
|waterfall|10|1000|243.84|
|waterfall|50|1000|413.35|
|parallel|10|1000|145.45|
|parallelLimit|10|1000|196.36|
|series|10|500|140.98|
