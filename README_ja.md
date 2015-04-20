# Neo-Async v1.0.0

[![npm](https://img.shields.io/npm/v/neo-async.svg)](https://www.npmjs.com/package/neo-async)
[![Travis](https://img.shields.io/travis/suguru03/neo-async.svg)](https://travis-ci.org/suguru03/neo-async)
[![Codecov](https://img.shields.io/codecov/c/github/suguru03/neo-async.svg)](https://codecov.io/github/suguru03/neo-async?branch=master)
[![Dependency Status](https://gemnasium.com/suguru03/neo-async.svg)](https://gemnasium.com/suguru03/neo-async)
[![npm](https://img.shields.io/npm/dm/neo-async.svg)](https://www.npmjs.com/package/neo-async)

Neo-Asyncは[Async](https://github.com/caolan/async)にほぼ完全に互換性があり、より速く、高機能な非同期処理ライブラリです。  
Asyncは`waterfall`のdobule callbackを許容してますが、Neo-Asyncでは許容していません。

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
- [`EventEmitter`](#EventEmitter:) *

