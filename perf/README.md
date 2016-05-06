# benchmark

The benchmark tool is using `benchmark.js` and `func-comparator`.

## How to execute

```bash
// execute all cases
$ node ./

// specify benchmark tool
$ node ./ -b benchmark // ['benchmark', 'func-comparator']
$ node ./ -b bench
$ node ./ --benchmark func

// specify function name
$ node ./ --target each // all `each` tasks
$ node ./ --target each:array // only `each:array` task

// specify times (only func-comparator)
$ node ./ -t 10
$ node ./ --times 10
```

## Sample

```bash
$ node ./ --target each

======================================
[async], v2.0.0-rc.4
[neo_async], v2.0.0_pre
======================================
[each:array] Comparating...
--------------------------------------
[benchmark] Executing...
[1] "neo_async" 7.30μs[1.00][1.00]
[2] "async" 22.0μs[0.332][3.01]
--------------------------------------
[func-comparator] Executing...
[1] "neo_async" 80.4μs[1.00][1.00]
[2] "async" 185μs[0.435][2.30]
======================================
[each:object] Comparating...
--------------------------------------
[benchmark] Executing...
[1] "neo_async" 14.6μs[1.00][1.00]
[2] "async" 32.0μs[0.456][2.19]
--------------------------------------
[func-comparator] Executing...
[1] "neo_async" 135μs[1.00][1.00]
[2] "async" 236μs[0.572][1.75]
======================================
[each:map] Comparating...
--------------------------------------
[benchmark] Executing...
[1] "neo_async" 9.44μs[1.00][1.00]
[2] "async" 31.7μs[0.297][3.36]
--------------------------------------
[func-comparator] Executing...
[1] "neo_async" 86.4μs[1.00][1.00]
[2] "async" 238μs[0.363][2.75]
```
