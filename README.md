# Neo-Async v1.6.0

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
- [`eachOf`](http://suguru03.github.io/neo-async/doc/async.each.html) -> [`each`](http://suguru03.github.io/neo-async/doc/async.each.html)
- [`eachOfSeries`](http://suguru03.github.io/neo-async/doc/async.eachSeries.html) -> [`eachSeries`](http://suguru03.github.io/neo-async/doc/async.eachSeries.html)
- [`eachOfLimit`](http://suguru03.github.io/neo-async/doc/async.eachLimit.html) -> [`eachLimit`](http://suguru03.github.io/neo-async/doc/async.eachLimit.html)
- [`forEachOf`](http://suguru03.github.io/neo-async/doc/async.each.html) -> [`each`](http://suguru03.github.io/neo-async/doc/async.each.html)
- [`forEachOfSeries`](http://suguru03.github.io/neo-async/doc/async.eachSeries.html) -> [`eachSeries`](http://suguru03.github.io/neo-async/doc/async.eachSeries.html)
- [`eachOfLimit`](http://suguru03.github.io/neo-async/doc/async.eachLimit.html) -> [`forEachLimit`](http://suguru03.github.io/neo-async/doc/async.eachLimit.html)
- [`map`](http://suguru03.github.io/neo-async/doc/async.map.html)
- [`mapSeries`](http://suguru03.github.io/neo-async/doc/async.mapSeries.html)
- [`mapLimit`](http://suguru03.github.io/neo-async/doc/async.mapLimit.html)
- [`mapValues`](http://suguru03.github.io/neo-async/doc/async.mapValues.html) *
- [`mapValuesSeries`](http://suguru03.github.io/neo-async/doc/async.mapValuesSeries.html) *
- [`mapValuesLimit`](http://suguru03.github.io/neo-async/doc/async.mapValuesLimit.html) *
- [`filter`](http://suguru03.github.io/neo-async/doc/async.filter.html)
- [`filterSeries`](http://suguru03.github.io/neo-async/doc/async.filterSeries.html)
- [`filterLimit`](http://suguru03.github.io/neo-async/doc/async.filterLimit.html)
- [`select`](http://suguru03.github.io/neo-async/doc/async.filter.html) -> [`filter`](http://suguru03.github.io/neo-async/doc/async.filter.html)
- [`selectSeries`](http://suguru03.github.io/neo-async/doc/async.filterSeries.html) -> [`filterSeries`](http://suguru03.github.io/neo-async/doc/async.filterSeries.html)
- [`selectLimit`](http://suguru03.github.io/neo-async/doc/async.filterLimit.html) -> [`filterLimit`](http://suguru03.github.io/neo-async/doc/async.filterLimit.html)
- [`reject`](http://suguru03.github.io/neo-async/doc/async.reject.html)
- [`rejectSeries`](http://suguru03.github.io/neo-async/doc/async.rejectSeries.html)
- [`rejectLimit`](http://suguru03.github.io/neo-async/doc/async.rejectLimit.html)
- [`detect`](http://suguru03.github.io/neo-async/doc/async.detect.html)
- [`detectSeries`](http://suguru03.github.io/neo-async/doc/async.detectSeries.html)
- [`detectLimit`](http://suguru03.github.io/neo-async/doc/async.detectLimit.html)
- [`pick`](http://suguru03.github.io/neo-async/doc/async.pick.html) *
- [`pickSeries`](http://suguru03.github.io/neo-async/doc/async.pickSeries.html) *
- [`pickLimit`](http://suguru03.github.io/neo-async/doc/async.pickLimit.html) *
- [`omit`](http://suguru03.github.io/neo-async/doc/async.omit.html) *
- [`omitSeries`](http://suguru03.github.io/neo-async/doc/async.omitSeries.html) *
- [`omitLimit`](http://suguru03.github.io/neo-async/doc/async.omitLimit.html) *
- [`reduce`](http://suguru03.github.io/neo-async/doc/async.reduce.html)
- [`inject`](http://suguru03.github.io/neo-async/doc/async.reduce.html) -> [`reduce`](http://suguru03.github.io/neo-async/doc/async.reduce.html)
- [`foldl`](http://suguru03.github.io/neo-async/doc/async.reduce.html) -> [`reduce`](http://suguru03.github.io/neo-async/doc/async.reduce.html)
- [`reduceRight`](http://suguru03.github.io/neo-async/doc/async.reduceRight.html)
- [`foldr`](http://suguru03.github.io/neo-async/doc/async.reduceRight.html) -> [`reduceRight`](http://suguru03.github.io/neo-async/doc/async.reduceRight.html)
- [`transform`](http://suguru03.github.io/neo-async/doc/async.transform.html) *
- [`transformSeries`](http://suguru03.github.io/neo-async/doc/async.transformSeries.html) *
- [`transformLimit`](http://suguru03.github.io/neo-async/doc/async.transformLimit.html) *
- [`sortBy`](http://suguru03.github.io/neo-async/doc/async.sortBy.html)
- [`sortBySeries`](http://suguru03.github.io/neo-async/doc/async.sortBySeries.html)
- [`sortByLimit`](http://suguru03.github.io/neo-async/doc/async.sortByLimit.html) *
- [`some`](http://suguru03.github.io/neo-async/doc/async.some.html)
- [`someSeries`](http://suguru03.github.io/neo-async/doc/async.someSeries.html)
- [`someLimit`](http://suguru03.github.io/neo-async/doc/async.someLimit.html)
- [`any`](http://suguru03.github.io/neo-async/doc/async.some.html) -> [`some`](http://suguru03.github.io/neo-async/doc/async.some.html)
- [`every`](http://suguru03.github.io/neo-async/doc/async.every.html)
- [`everySeries`](http://suguru03.github.io/neo-async/doc/async.everySeries.html) *
- [`everyLimit`](http://suguru03.github.io/neo-async/doc/async.everyLimit.html)
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
- [`times`](http://suguru03.github.io/neo-async/doc/async.times.html)
- [`timesSeries`](http://suguru03.github.io/neo-async/doc/async.timesSeries.html)
- [`timesLimit`](http://suguru03.github.io/neo-async/doc/async.timesLimit.html)

### Utils
- [`apply`](#apply)
- [`nextTick`](#nextTick)
- [`setImmediate`](#setImmediate)
- [`safeNextTick`](#safeNextTick) *
- [`asyncify`](#asyncify)
- [`wrapSync`](#asyncify) -> [`asyncify`](#asyncify)
- [`constant`](#constant)
- [`ensureAsync`](#ensureAsync)
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

* async v1.3.0
* neo-async v1.3.0

### Server-side

Speed comparison of server-side measured by [func-comparator](https://github.com/suguru03/func-comparator).

Specifications are as follows.

* n times trials
* Random execution order
* Measure the average speed[μs] of n times

__execute__

* 100 times trials
* 500000 tasks

Execution environment are as follows.

* node v0.10.40
* node v0.12.7
* iojs v2.3.4

```bash
$ node perf/func-comparator
```
__result__

The value is the ratio (Neo-Async/Async) of the average speed per n times.

##### collections

|function|node v0.10.40|node v0.12.7|iojs v2.3.4|
|---|---|---|---|
|each|2.01|1.95|2.19|
|eachSeries|2.28|2.62|2.28|
|eachLimit|2.33|3.32|2.81|
|eachOf|1.93|1.92|2.12|
|eachOfSeries|2.17|2.79|2.98|
|eachOfLimit|2.03|1.54|2.57|
|map|3.10|3.11|3.38|
|mapSeries|2.36|1.98|2.32|
|mapLimit|1.76|1.84|2.06|
|filter|2.33|3.70|6.59|
|filterSeries|2.11|2.71|3.68|
|reject|2.71|4.38|7.33|
|rejectSeries|2.31|3.09|3.86|
|detect|2.31|2.69|2.92|
|detectSeries|2.13|1.96|2.71|
|reduce|2.09|1.94|2.26|
|reduceRight|2.19|1.93|2.51|
|sortBy|1.41|1.66|1.52|
|some|2.23|2.29|2.50|
|every|2.22|2.25|2.93|
|concat|12.0|7.23|10.0|
|concatSeries|8.37|5.15|8.05|

##### control flow

|function|node v0.10.40|node v0.12.7|iojs v2.3.4|
|---|---|---|---|
|parallel|4.13|5.00|3.37|
|series|3.13|2.70|3.03|
|parallelLimit|2.69|2.96|2.49|
|waterfall|3.45|7.24|7.59|
|whilst|1.02|1.09|1.14|
|doWhilst|1.26|1.36|1.28|
|until|1.02|1.08|1.13|
|doUntil|1.25|1.31|1.34|
|during|2.15|2.08|2.08|
|doDuring|5.08|5.77|5.39|
|times|4.07|3.16|3.44|
|timesSeries|2.82|2.58|2.71|
|timesLimit|2.23|2.05|1.93|
