# Neo-Async v1.3.0

[![npm](https://img.shields.io/npm/v/neo-async.svg)](https://www.npmjs.com/package/neo-async)
[![Travis](https://img.shields.io/travis/suguru03/neo-async.svg)](https://travis-ci.org/suguru03/neo-async)
[![Codecov](https://img.shields.io/codecov/c/github/suguru03/neo-async.svg)](https://codecov.io/github/suguru03/neo-async?branch=master)
[![Dependency Status](https://gemnasium.com/suguru03/neo-async.svg)](https://gemnasium.com/suguru03/neo-async)
[![npm](https://img.shields.io/npm/dm/neo-async.svg)](https://www.npmjs.com/package/neo-async)

Neo-Async is thought to be used as a drop-in replacement for [Async](https://github.com/caolan/async), it almost fully covers its functionality and runs [faster](#speed-comparison).  
[Async](https://github.com/caolan/async) allows double callbacks in `waterfall`, but Neo-Async does not allow. ([test](https://github.com/suguru03/async/tree/neo-async/test))  
PR is welcome ! Especially improvement for English documents :)

![Neo-Async](https://raw.githubusercontent.com/wiki/suguru03/neo-async/images/neo_async.png)

![nodei](https://nodei.co/npm/neo-async.png?downloads=true&downloadRank=true)

## Installation

### In a browser
```html
<script src="async.min.js"></script>
```

### In an AMD loader
```js
require(['async'], function(async) {});
```

### Node.js

#### standard

```bash
$ npm install neo-async
```
```js
var async = require('neo-async');

// safe mode
var async = require('neo-async').safe; // avoid stack overflow if iterator is called on sync.
```

#### replacement
```bash
$ npm install neo-async
$ ln -s ./node_modules/neo-async ./node_modules/async
```
```js
var async = require('async');
```

### Bower

```bash
bower install neo-async
```

## Feature

[JSDoc](http://suguru03.github.io/neo-async/doc/async.html)

\* not in Async

### Collections

- [`each`](http://suguru03.github.io/neo-async/doc/async.each.html)
- [`eachSeries`](http://suguru03.github.io/neo-async/doc/async.eachSeries.html)
- [`eachLimit`](http://suguru03.github.io/neo-async/doc/async.eachLimit.html)
- [`forEach`](http://suguru03.github.io/neo-async/doc/async.each.html) -> [`each`](http://suguru03.github.io/neo-async/doc/async.each.html)
- [`forEachSeries`](http://suguru03.github.io/neo-async/doc/async.eachSeries.html) -> [`eachSeries`](http://suguru03.github.io/neo-async/doc/async.eachSeries.html)
- [`forEachLimit`](http://suguru03.github.io/neo-async/doc/async.eachLimit.html) -> [`eachLimit`](http://suguru03.github.io/neo-async/doc/async.eachLimit.html)
- [`map`](http://suguru03.github.io/neo-async/doc/async.map.html)
- [`mapSeries`](http://suguru03.github.io/neo-async/doc/async.mapSeries.html)
- [`mapLimit`](http://suguru03.github.io/neo-async/doc/async.mapLimit.html)
- [`mapValues`](http://suguru03.github.io/neo-async/doc/async.mapValues.html) *
- [`mapValuesSeries`](http://suguru03.github.io/neo-async/doc/async.mapValuesSeries.html) *
- [`mapValuesLimit`](http://suguru03.github.io/neo-async/doc/async.mapValuesLimit.html) *
- [`filter`](http://suguru03.github.io/neo-async/doc/async.filter.html)
- [`filterSeries`](http://suguru03.github.io/neo-async/doc/async.filterSeries.html)
- [`filterLimit`](http://suguru03.github.io/neo-async/doc/async.filterLimit.html) *
- [`select`](http://suguru03.github.io/neo-async/doc/async.filter.html) -> [`filter`](http://suguru03.github.io/neo-async/doc/async.filter.html)
- [`selectSeries`](http://suguru03.github.io/neo-async/doc/async.filterSeries.html) -> [`filterSeries`](http://suguru03.github.io/neo-async/doc/async.filterSeries.html)
- [`selectLimit`](http://suguru03.github.io/neo-async/doc/async.filterLimit.html) -> [`filterLimit`](http://suguru03.github.io/neo-async/doc/async.filterLimit.html) *
- [`reject`](http://suguru03.github.io/neo-async/doc/async.reject.html)
- [`rejectSeries`](http://suguru03.github.io/neo-async/doc/async.rejectSeries.html)
- [`rejectLimit`](http://suguru03.github.io/neo-async/doc/async.rejectLimit.html) *
- [`detect`](http://suguru03.github.io/neo-async/doc/async.detect.html)
- [`detectSeries`](http://suguru03.github.io/neo-async/doc/async.detectSeries.html)
- [`detectLimit`](http://suguru03.github.io/neo-async/doc/async.detectLimit.html) *
- [`pick`](http://suguru03.github.io/neo-async/doc/async.pick.html) *
- [`pickSeries`](http://suguru03.github.io/neo-async/doc/async.pickSeries.html) *
- [`pickLimit`](http://suguru03.github.io/neo-async/doc/async.pickLimit.html) *
- [`reduce`](http://suguru03.github.io/neo-async/doc/async.reduce.html)
- [`inject`](http://suguru03.github.io/neo-async/doc/async.reduce.html) -> [`reduce`](http://suguru03.github.io/neo-async/doc/async.reduce.html)
- [`foldl`](http://suguru03.github.io/neo-async/doc/async.reduce.html) -> [`reduce`](http://suguru03.github.io/neo-async/doc/async.reduce.html)
- [`reduceRight`](http://suguru03.github.io/neo-async/doc/async.reduceRight.html)
- [`foldr`](http://suguru03.github.io/neo-async/doc/async.reduceRight.html) -> [`reduceRight`](http://suguru03.github.io/neo-async/doc/async.reduceRight.html)
- [`transform`](http://suguru03.github.io/neo-async/doc/async.transform.html) *
- [`transformSeries`](http://suguru03.github.io/neo-async/doc/async.transformSeries.html) *
- [`transformLimit`](http://suguru03.github.io/neo-async/doc/async.transformLimit.html) *
- [`sortBy`](http://suguru03.github.io/neo-async/doc/async.sortBy.html) *
- [`sortBySeries`](http://suguru03.github.io/neo-async/doc/async.sortBySeries.html) *
- [`sortByLimit`](http://suguru03.github.io/neo-async/doc/async.sortByLimit.html) *
- [`some`](http://suguru03.github.io/neo-async/doc/async.some.html)
- [`someSeries`](http://suguru03.github.io/neo-async/doc/async.someSeries.html) *
- [`someLimit`](http://suguru03.github.io/neo-async/doc/async.someLimit.html) *
- [`any`](http://suguru03.github.io/neo-async/doc/async.some.html) -> [`some`](http://suguru03.github.io/neo-async/doc/async.some.html)
- [`every`](http://suguru03.github.io/neo-async/doc/async.every.html)
- [`everySeries`](http://suguru03.github.io/neo-async/doc/async.everySeries.html) *
- [`everyLimit`](http://suguru03.github.io/neo-async/doc/async.everyLimit.html) *
- [`all`](http://suguru03.github.io/neo-async/doc/async.every.html) -> [`every`](http://suguru03.github.io/neo-async/doc/async.every.html)
- [`concat`](http://suguru03.github.io/neo-async/doc/async.concat.html)
- [`concatSeries`](http://suguru03.github.io/neo-async/doc/async.concatSeries.html)
- [`concatLimit`](http://suguru03.github.io/neo-async/doc/async.concatLimit.html) *

### Control Flow

- [`parallel`](http://suguru03.github.io/neo-async/doc/async.parallel.html)
- [`series`](http://suguru03.github.io/neo-async/doc/async.series.html)
- [`parallelLimit`](http://suguru03.github.io/neo-async/doc/async.series.html)
- [`waterfall`](http://suguru03.github.io/neo-async/doc/async.waterfall.html)
- [`angelFall`](http://suguru03.github.io/neo-async/doc/async.angelFall.html) *
- [`angelfall`](http://suguru03.github.io/neo-async/doc/async.angelFall.html) -> [`angelFall`](http://suguru03.github.io/neo-async/doc/async.angelFall.html) *
- [`whilst`](#whilst)
- [`doWhilst`](#doWhilst)
- [`until`](#until)
- [`forever`](#forever)
- [`compose`](#compose)
- [`seq`](#seq)
- [`applyEach`](#applyEach)
- [`applyEachSeries`](#applyEachSeries)
- [`queue`](#queue)
- [`priorityQueue`](#priorityQueue)
- [`cargo`](#cargo)
- [`auto`](#auto)
- [`retry`](#retry)
- [`iterator`](#iterator)
- [`apply`](#apply)
- [`nextTick`](#nextTick)
- [`setImmediate`](#setImmediate)
- [`safeNextTick`](#safeNextTick) *
- [`times`](http://suguru03.github.io/neo-async/doc/async.times.html)
- [`timesSeries`](http://suguru03.github.io/neo-async/doc/async.timesSeries.html)
- [`timesLimit`](http://suguru03.github.io/neo-async/doc/async.timesLimit.html) *

### Utils
- [`memoize`](#memoize)
- [`unmemoize`](#unmemoize)
- [`log`](#log)
- [`dir`](#dir)
- [`createLogger`](#createLogger)
- [`noConflict`](#noConflict)
- [`eventEmitter`](#eventEmitter) *
- [`EventEmitter`](#EventEmitter) *
- [`safe`](#safe) *

### Safe

```js
var async = require('neo-async').safe;
// or
var async = require('neo-async');
async.safe.each(collection, iterator, callback);
```

## Speed Comparison

* async v0.9.0
* neo-async v0.6.4
* neo-async v1.0.0

### Server-side

Speed comparison of server-side measured by [func-comparator](https://github.com/suguru03/func-comparator).  
Specifications are as follows.

* n times trials
* Random execution order
* Measure the average speed[μs] of n times

__sample.parllel.js__

```js
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async = require('neo-async');

var count = 100; // the number of parallel tasks
var times = 100000; // the number of trial times
var array = _.shuffle(_.times(count));
var tasks = _.map(array, function() {
    return function(next) {
        next();
    };
});

// functions will be executed by random order
var funcs = {
    'async': function(callback) {
        async.parallel(tasks, callback);
    },
    'neo-async': function(callback) {
        neo_async.parallel(tasks, callback);
    }
};

comparator
.set(funcs)
.async()
.times(times)
.start()
.result(console.log);
```

__execute__

* 100 times trials
* 100000 tasks

Execution environment are as follows.

* node v0.10.39
* node v0.12.5
* iojs v2.3.2

```bash
$ gulp speed_test --file parallel
```
__result__

The value is the ratio (Neo-Async/Async) of the average speed per n times.

##### control flow

|function|node v0.10.39|node v0.12.5|iojs v2.3.1|
|---|---|---|---|
|parallel|4.13|4.16|3.29|
|series|9.13|10.9|8.29|
|parallelLimit|4.89|4.24|3.77|
|waterfall|38.4|58.4|62.5|

##### collections

|function|node v0.10.39|node v0.12.5|iojs v2.3.2|
|---|---|---|---|
|each|2.01|2.08|2.16|
|eachSeries|7.11|13.6|6.86|
|eachLimit|5.84|3.71|4.04|
|map|3.11|3.01|3.47|
|mapSeries|9.79|13.9|10.6|
|mapLimit|4.74|2.95|3.14|
|filter|2.34|3.64|5.76|
