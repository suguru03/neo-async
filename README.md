# Neo-Async v1.0.0

[![npm](https://img.shields.io/npm/v/neo-async.svg)](https://www.npmjs.com/package/neo-async)
[![Travis](https://img.shields.io/travis/suguru03/neo-async.svg)](https://travis-ci.org/suguru03/neo-async)
[![Codecov](https://img.shields.io/codecov/c/github/suguru03/neo-async.svg)](https://codecov.io/github/suguru03/neo-async?branch=master)
[![Dependency Status](https://gemnasium.com/suguru03/neo-async.svg)](https://gemnasium.com/suguru03/neo-async)
[![npm](https://img.shields.io/npm/dm/neo-async.svg)](https://www.npmjs.com/package/neo-async)

Neo-Async is thought to be used as a drop-in replacement for [Async](https://github.com/caolan/async), it almost fully covers its functionality and runs [faster](#speed-comparison).  
[Async](https://github.com/caolan/async) allows double callbacks in `waterfall`, but Neo-Async does not allow. ([test](https://github.com/suguru03/async/tree/neo-async/test))

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


- [`each`](#each)
- [`eachSeries`](#eachSeries)
- [`eachLimit`](#eachLimit)
- [`forEach`](#each) -> [`each`](#each)
- [`forEachSeries`](#eachSeries) -> [`eachSeries`](#eachSeries)
- [`forEachLimit`](#eachLimit) -> [`eachLimit`](#eachLimit)
- [`map`](#map)
- [`mapSeries`](#mapSeries)
- [`mapLimit`](#mapLimit)
- [`mapValues`](#mapValues) *
- [`mapValuesSeries`](#mapValuesSeries) *
- [`mapValuesLimit`](#mapValuesLimit) *
- [`filter`](#filter)
- [`filterSeries`](#filterSeries)
- [`filterLimit`](#filterLimit) *
- [`select`](#filter) -> [`filter`](#filter)
- [`selectSeries`](#filterSeries) -> [`filterSeries`](#filterSeries)
- [`selectLimit`](#filterLimit) -> [`filterLimit`](#filterlimit) *
- [`reject`](#reject)
- [`rejectSeries`](#rejectSeries)
- [`rejectLimit`](#rejectLimit) *
- [`detect`](#detect)
- [`detectSeries`](#detectSeries)
- [`detectLimit`](#detectLimit) *
- [`pick`](#pick) *
- [`pickSeries`](#pickSeries) *
- [`pickLimit`](#pickLimit) *
- [`reduce`](#reduce)
- [`inject`](#reduce) -> [`reduce`](#reduce)
- [`foldl`](#reduce) -> [`reduce`](#reduce)
- [`reduceRight`](#reduceRight)
- [`foldr`](#reduceRight) -> [`reduceRight`](#reduceRight)
- [`transform`](#transform) *
- [`transformSeries`](#transformSeries) *
- [`transformLimit`](#transformLimit) *
- [`sortBy`](#sortBy)
- [`sortBySeries`](#sortBySeries) *
- [`sortByLimit`](#sortByLimit) *
- [`some`](#some)
- [`someSeries`](#someSeries) *
- [`someLimit`](#someLimit) *
- [`any`](#some) -> [`some`](#some)
- [`every`](#every)
- [`everySeries`](#everySeries) *
- [`everyLimit`](#everyLimit) *
- [`all`](#every) -> [`every`](#every)
- [`concat`](#concat)
- [`concatSeries`](#concatSeries)
- [`concatLimit`](#concatLimit) *

### Control Flow

- [`parallel`](#parallel)
- [`series`](#series)
- [`parallelLimit`](#parallelLimit)
- [`waterfall`](#waterfall)
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
- [`times`](#times)
- [`timesSeries`](#timesSeries)
- [`timesLimit`](#timesLimit) *

### Utils
- [`memoize`](#memoize)
- [`unmemoize`](#unmemoize)
- [`log`](#log)
- [`dir`](#dir)
- [`createLogger`](#createLogger)
- [`noConflict`](#noConflict)
- [`eventEmitter`](#eventEmitter) * 
- [`EventEmitter`](#EventEmitter) *

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

* node v0.10.38
* node v0.12.2
* iojs v1.8.1

```bash
$ gulp speed_test --file parallel
```
__result__

The value is the ratio (Neo-Async/Async) of the average speed per n times.

##### control flow

|function|node v0.10.38|node v0.12.2|iojs v1.8.1|
|---|---|---|---|
|parallel|5.97|6.44|6.68|
|series|6.99|7.82|7.66|
|parallelLimit|5.56|4.99|6.15|
|waterfall|23.38|33.99|36.93|
|times|4.36|4.22|4.15|
|timesSeries|5.05|4.32|3.72|

##### collections

|function|node v0.10.38|node v0.12.2|iojs v1.8.1|
|---|---|---|---|
|each|2.10|2.32|2.56|
|eachSeries|1.04|1.22|1.23|
|eachLimit|1.68|0.91|1.08|
|map|3.90|4.03|4.56|
|mapSeries|3.98|5.10|4.65|
|mapLimit|3.60|2.85|3.44|
|filter|3.21|3.12|3.26|
|filterSeries|5.29|7.00|5.58|
|reduce|2.05|1.96|2.49|
|reduceRight|3.71|4.01|4.09|
|sortBy|1.06|1.54|1.42|
|some|2.63|2.64|3.03|
|every|2.70|2.66|3.09|
|concat|3.02|2.34|2.67|
|concatSeries|2.56|2.42|2.65|
