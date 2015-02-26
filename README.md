# Neo-Async
[![npm](https://img.shields.io/npm/v/neo-async.svg)](https://www.npmjs.com/package/neo-async)
[![Travis](https://img.shields.io/travis/suguru03/neo-async.svg)](https://travis-ci.org/suguru03/neo-async)
[![Codecov](https://img.shields.io/codecov/c/github/suguru03/neo-async.svg)](https://codecov.io/github/suguru03/neo-async?branch=master)
[![Dependency Status](https://gemnasium.com/suguru03/neo-async.svg)](https://gemnasium.com/suguru03/neo-async)
[![npm](https://img.shields.io/npm/dm/neo-async.svg)](https://www.npmjs.com/package/neo-async)

Neo-Async is thought to be used as a drop-in replacement for [Async](https://github.com/caolan/async), it almost fully covers its functionality and runs [faster](#speed-comparison)

![Neo-Async](https://raw.githubusercontent.com/wiki/suguru03/neo-async/images/neo_async.png)

![nodei](https://nodei.co/npm/neo-async.png?downloads=true&downloadRank=true)

## Speed Comparison

* async v0.9.0
* neo-async v0.4.9

### Front-end

Speed comparison of front-end measured by [jsPerf](http://jsperf.com/).  
Measurement environment are as follows.

* Chrome 40.0.2214
* FireFox 34.0
* Safari 8.0.2

![waterfall](https://raw.githubusercontent.com/wiki/suguru03/neo-async/images/jsperf_waterfall.png)
figure 1: waterfall sample

The value is the ratio (Neo-Async/Async) of the executions numbers per second.

|function|Chrome|FireFox|Safari|url|
|---|---|---|---|---|
|waterfall|2.18|2.20|2.36|http://jsperf.com/async-waterfall/7|
|series|1.50|1.31|1.10|http://jsperf.com/async-series/8|
|parallel|15.67|10.17|5.01|http://jsperf.com/async-parallel/5|
|parallelLimit|1.35|1.41|1.11|http://jsperf.com/async-parallel-limit/2|

### Server-side

Speed comparison of server-side measured by [func-comparator](https://github.com/suguru03/func-comparator).  
Specifications are as follows.

* n times trials
* Random execution order
* Execute GC every time
* Measure the average speed[μs] of n times

__demo.js__

```js
var comparator = require('func-comparator');
var _ = require('lodash');
var async = require('async');
var neo_async = require('neo-async');

var count = 10; // the number of parallel tasks
var n = 1000; // the number of trial times
var array = _.shuffle(_.times(count));
var tasks = _.map(array, function(n) {
    return function(next) {
        next(null, n);
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
.option({
    async: true,
    times: n
})
.start()
.result(console.log);
```

__execute__

* 10 times trials
* 1000 tasks

Execution environment are as follows.

* node v0.10.35
* iojs v1.0.2

```bash
$ node --expose_gc demo.js
$ iojs --expose_gc demo.js
```
__result__

The value is the ratio (Neo-Async/Async) of the average speed per n times.

|function|node|iojs|
|---|---|---|
|waterfall|3.47|12.05|
|series|1.98|6.38|
|parallel|2.94|8.94|
|paralellLimit|2.88|6.13|

The results show that we could improve perfomance by using either node or iojs.

## Improvement of convenience

neo-async also have loop support for Object which is unsupported in async.

```js
var object = {
    HOGE: 'hoge',
    FUGA: 'fuga',
    PIYO: 'piyo'
};

async.each(Object.keys(object), function(key, done) {
    var str = object[key];
    /* processing */
    done();
}, callback);

neo_async.each(object, function(str, done) {
    /* processing */
    done();
}, callback, thisArg);
```

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

## Feature *not* in Async

### Collections

* [`concatLimit`](#concatLimit)
* [`mapValues`](#mapValues)
* [`mapValuesSeries`](#mapValuesSeries)
* [`mapValuesLimit`](#mapValuesLimit)
* [`detectLimit`](#detectLimit)
* [`everySeries`](#everySeries)
* [`everyLimit`](#everyLimit)
* [`filterLimit`](#filterLimit)
* [`pick`](#pick)
* [`pickSeries`](#pickSeries)
* [`pickLimit`](#pickLimit)
* [`rejectLimit`](#rejectLimit)
* [`selectLimit`](#filterLimit)
* [`someSeries`](#someSeries)
* [`someLimit`](#someLimit)
* [`sortBySeries`](#sortBySeries)
* [`sortByLimit`](#sortByLimit)
* [`transform`](#transform)
* [`transformSeries`](#transformSeries)
* [`transformLimit`](#transformLimit)

### Control Flow

* [`timesLimit`](#timesLimit)

### Utils

* [`eventEmitter`](#eventEmitter)
