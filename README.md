# Neo-Async

Neo-Async is faster than Async.js and has more feature.

```bash
$ npm install neo-async
```

## Speed Comparison

### Results
* series
    * 2.6ms ⇒ 1.1ms
    * 1.5ms短縮
* parallel
    * 3.3ms ⇒ 1.2ms
    * 2.1ms短縮
* waterfall
    * 11.9ms ⇒ 3.2ms
    * 8.7ms短縮

### Common
```js
var _ = require('lodash');
var async = require('async');
var neo_async = require('neo-async');
var start = function() {
  return process.hrtime();
};
var getDiff = function(start) {
  var diff = process.hrtime(start);
  return diff[0] * 1e9 + diff[1];
};
var sample = 1000;
var time = {
  async: 0,
  neo_async: 0
};
```

### series

```js
var tasks = _.map(_.times(sample), function(item) {
  return function(callback) {
    callback(null, item);
  };
});

var timer = start();
async.series(tasks, function(err, res1) {
   time.async = getDiff(timer);

   timer = start();
    neo_async.series(tasks, function(err, res2) {
      time.neo_async = getDiff(timer);

      var check = _.every(res1, function(item, index) {
        return res2[index] === item;
      });
      console.log('check', check);
      console.log('**** time ****');
      console.log(time.async - time.neo_async);
    });
});
```
* async, neo_asyncの順
    * { async: 2632607, neo_async: 1097360 }
    * 1.5ms短縮 (1535247ns)
* neo_sync, asyncの順
    * { async: 3749187, neo_async: 1615040 }
    * 2.1ms短縮 (2134147ns)

### parallel

```js
var tasks = _.map(_.times(sample), function(item) {
  return function(callback) {
    callback(null, item);
  };
});

var timer = start();
neo_async.parallel(tasks, function(err, res1) {
   time.neo_async = getDiff(timer);

   timer = start();
    async.parallel(tasks, function(err, res2) {
      time.async = getDiff(timer);

      var check = _.every(res1, function(item, index) {
        return res2[index] === item;
      });
      console.log('check', check);
      console.log('**** time ****');
      console.log(time.async - time.neo_async);
    });
});
```
* async, neo_asyncの順
    * { async: 3291565, neo_async: 1166516 }
    * 2.1ms短縮 (2125049ns)
* neo_sync, asyncの順
    * { async: 3326372, neo_async: 1174852 }
    * 2.1ms短縮 (2151520ns)

### waterfall

```js
var tasks = (function createSimpleTasks(num) {
  var first = true;
  var tasks = _.transform(_.times(num), function(memo, num, key) {
    if (first) {
      first = false;
      memo[key] = function(done) {
        done(null, num);
      };
    } else {
      memo[key] = function(sum, done) {
        done(null, sum + num);
      };
    }
  });
  return tasks;
})(sample);

var timer = start();
async.waterfall(tasks, function(err, res1) {
  time.neo_async = getDiff(timer);

  timer = start();
  async.waterfall(tasks, function(err, res2) {
    time.async = getDiff(timer);

    console.log('check', res1 === res2);
    console.log('**** time ****');
    console.log(time.async - time.neo_async);
  });
});
```

* async, neo_asyncの順
    * { async: 11875267, neo_async: 3183565 }
    * 8.7ms短縮 (8691702ns)
* neo_sync, asyncの順
    * { async: 11667079, neo_async: 2760822 }
    * 8.9ms短縮 (8906257ns)


## Feature

### Collections

* async.each [Series, Limit]
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
