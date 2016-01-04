<a name"v1.7.2"></a>
### v1.7.2 (2016-01-03)


#### Bug Fixes

* **auto:** fix to stop after an synchronous error ([dd92a34c](https://github.com/suguru03/neo-async/commit/dd92a34c))


#### Other Changes

* **CHANGELOG:** v1.7.1 [ci skip] ([bcafae7e](https://github.com/suguru03/neo-async/commit/bcafae7e))

<a name"v1.7.1"></a>
### v1.7.1 (2015-12-06)


#### Bug Fixes

* **auto:** fix a bug when it has concurrency without callback ([d98dc8ac](https://github.com/suguru03/neo-async/commit/d98dc8ac))


#### Features

* **doWhilst:** modify to get the last result and improve performance ([6204531b](https://github.com/suguru03/neo-async/commit/6204531b))
* **whilst:** fix to get the last result ([6a33ef46](https://github.com/suguru03/neo-async/commit/6a33ef46))


#### Other Changes

* feat(until) modify to get the last result ([f9445e91](https://github.com/suguru03/neo-async/commit/f9445e91))
* **CHANGELOG:** v1.7.0 [ci skip] ([c01e5431](https://github.com/suguru03/neo-async/commit/c01e5431))
* **whilst:** add test case ([1ed7c530](https://github.com/suguru03/neo-async/commit/1ed7c530))

<a name"v1.7.0"></a>
## v1.7.0 (2015-11-14)


#### Features

* **auto:** add feature of concurrency control ([59230095](https://github.com/suguru03/neo-async/commit/59230095))
* **cargo:** add `workersList` ([0583bd94](https://github.com/suguru03/neo-async/commit/0583bd94))
* **queue:** add `workersList` and rename `task` to `data` in task param ([21cd097a](https://github.com/suguru03/neo-async/commit/21cd097a))


#### Other Changes

* **CHANGELOG:** v1.6.0 [ci skip] ([78cd148e](https://github.com/suguru03/neo-async/commit/78cd148e))
* **cargo:** fix to use delay of config ([d85b4a61](https://github.com/suguru03/neo-async/commit/d85b4a61))
* **changelog:** modify changelog task ([7936eb98](https://github.com/suguru03/neo-async/commit/7936eb98))
* **gh-pages:** modify gh-pages task ([1234aa14](https://github.com/suguru03/neo-async/commit/1234aa14))
* **queue:** add to check pause in worker with concurrency ([ac25d007](https://github.com/suguru03/neo-async/commit/ac25d007))
* **travis:**
  * fix test process ([eba556f5](https://github.com/suguru03/neo-async/commit/eba556f5))
  * add node v5 ([4b025c0a](https://github.com/suguru03/neo-async/commit/4b025c0a))

<a name"v1.6.0"></a>
## v1.6.0 (2015-10-22)


#### Features

* **omit:** add feature of `omit` ([bc4376be](https://github.com/suguru03/neo-async/commit/bc4376be))


#### Other Changes

* **README:** add `omit` to feature ([f80767e5](https://github.com/suguru03/neo-async/commit/f80767e5))

<a name"v1.5.1"></a>
### v1.5.1 (2015-10-15)


#### Features

* **mapvalues:** fix to use common function with `map` ([8ffa0448](https://github.com/suguru03/neo-async/commit/8ffa0448))


#### Other Changes

* **CHANGELOG:** v1.5.0 [ci skip] ([becacf81](https://github.com/suguru03/neo-async/commit/becacf81))
* **async:** rename `length` to `size` ([623044db](https://github.com/suguru03/neo-async/commit/623044db))
* **every:** add test case ([7440e354](https://github.com/suguru03/neo-async/commit/7440e354))
* **test:** modify to use `mocha.parallel` ([10af3dbb](https://github.com/suguru03/neo-async/commit/10af3dbb))
* **times:** fix test case ([b016ea6f](https://github.com/suguru03/neo-async/commit/b016ea6f))

<a name"v1.5.0"></a>
## v1.5.0 (2015-09-10)


#### Bug Fixes

* **nextTick:** fix to use `setImmediate` on node v0.10.x ([4ef5ae73](https://github.com/suguru03/neo-async/commit/4ef5ae73))


#### Features

* **angelFall:** improve to execute even if task has no argument ([99f54414](https://github.com/suguru03/neo-async/commit/99f54414))
* **apply:** fix to enable to use `Function#length` ([81e84770](https://github.com/suguru03/neo-async/commit/81e84770))
* **concat:** modify to support symbol iterator ([6752e7c0](https://github.com/suguru03/neo-async/commit/6752e7c0))
* **detect:** modify to support symbol iterator ([6dcff7f9](https://github.com/suguru03/neo-async/commit/6dcff7f9))
* **each:** add `symbolEach` funciton to support es2015 ([1959bcac](https://github.com/suguru03/neo-async/commit/1959bcac))
* **eachLimit:** modify to support symbol iterator ([04642f3e](https://github.com/suguru03/neo-async/commit/04642f3e))
* **eachSeries:** modify to support symbol iterator ([138d7b37](https://github.com/suguru03/neo-async/commit/138d7b37))
* **filter:** modify to support symbol iterator ([68c7656f](https://github.com/suguru03/neo-async/commit/68c7656f))
* **map:** modify to support symbol iterator ([ef982ca1](https://github.com/suguru03/neo-async/commit/ef982ca1))
* **mapValues:** modify to support symbol iterator ([196a79d1](https://github.com/suguru03/neo-async/commit/196a79d1))
* **pick:** modify to support symbol iterator ([cf1ed7c5](https://github.com/suguru03/neo-async/commit/cf1ed7c5))
* **reduce:** modify to support symbol iterator ([0c8b1257](https://github.com/suguru03/neo-async/commit/0c8b1257))
* **reduceRight:** modify to support symbol iterator ([13145158](https://github.com/suguru03/neo-async/commit/13145158))
* **reject:** modify to support symbol iterator and add test case ([c43f3925](https://github.com/suguru03/neo-async/commit/c43f3925))
* **sortBy:** modify to support symbol iterator ([1b8179eb](https://github.com/suguru03/neo-async/commit/1b8179eb))
* **transform:** modify to support symbol iterator ([2527f297](https://github.com/suguru03/neo-async/commit/2527f297))


#### Other Changes

* **CHANGELOG:** v1.4.1 [ci skip] ([2e9d4739](https://github.com/suguru03/neo-async/commit/2e9d4739))
* **async:** refactor and apply jsbeautify ([ac984f32](https://github.com/suguru03/neo-async/commit/ac984f32))
* **gh-pages:** fix `gh-pages` task ([ef25eb3b](https://github.com/suguru03/neo-async/commit/ef25eb3b))
* **map:**
  * refactor map ([7ee34d90](https://github.com/suguru03/neo-async/commit/7ee34d90))
  * fix to check response type ([ecf69efa](https://github.com/suguru03/neo-async/commit/ecf69efa))
* **mapLimit:** add test case ([469bb5c8](https://github.com/suguru03/neo-async/commit/469bb5c8))
* **other:** add test by using `vm` ([165834a1](https://github.com/suguru03/neo-async/commit/165834a1))
* **some:** add Map test ([d243343e](https://github.com/suguru03/neo-async/commit/d243343e))
* **test:** fix to check coverage ([5cb9ec55](https://github.com/suguru03/neo-async/commit/5cb9ec55))
* **travis:**
  * add node v4 ([98274a04](https://github.com/suguru03/neo-async/commit/98274a04))
  * fix npm test ([7771dda6](https://github.com/suguru03/neo-async/commit/7771dda6))
* **util:** add Map class for improving coverage of v0.10.x ([0178a497](https://github.com/suguru03/neo-async/commit/0178a497))

<a name"v1.4.1"></a>
### v1.4.1 (2015-08-24)


#### Bug Fixes

* **concat:** fix not to concatenate the falsy value with the result ([b7b1f07b](https://github.com/suguru03/neo-async/commit/b7b1f07b))


#### Features

* **filterLimit:** fix docs and function name ([fed73554](https://github.com/suguru03/neo-async/commit/fed73554))


#### Other Changes

* **CHANGELOG:** v1.4.0 [ci skip] ([cf582155](https://github.com/suguru03/neo-async/commit/cf582155))
* **filter:** fix to use `Array#length` ([e84206a8](https://github.com/suguru03/neo-async/commit/e84206a8))
* **filterSeries:** improve not to use `_compact` ([3540e032](https://github.com/suguru03/neo-async/commit/3540e032))

<a name"v1.4.0"></a>
## v1.4.0 (2015-08-21)


#### Features

* **concat:** remove `thisArg` ([d663bcf5](https://github.com/suguru03/neo-async/commit/d663bcf5))
* **detect:** remove `thisArg` from `createDetect` ([f12dc386](https://github.com/suguru03/neo-async/commit/f12dc386))
* **during:** remove `thisArg` ([22de81be](https://github.com/suguru03/neo-async/commit/22de81be))
* **each:** remove `thisArg` and add example of break ([dfc02bdf](https://github.com/suguru03/neo-async/commit/dfc02bdf))
* **filter:** remove `thisArg` from `async.filter` and `async.reject` ([76083b4a](https://github.com/suguru03/neo-async/commit/76083b4a))
* **forever:** remove `thisArg` ([a1e15074](https://github.com/suguru03/neo-async/commit/a1e15074))
* **map:** remove `thisArg` ([0fafad7d](https://github.com/suguru03/neo-async/commit/0fafad7d))
* **mapValues:** remove `thisArg` ([9b5d8d47](https://github.com/suguru03/neo-async/commit/9b5d8d47))
* **memoize:** remove `thisArg` ([6df16bc5](https://github.com/suguru03/neo-async/commit/6df16bc5))
* **parallel:** remove `thisArg` from `parallel` and `parallelLimit` ([98c7721b](https://github.com/suguru03/neo-async/commit/98c7721b))
* **pick:** remove `thisArg` ([240d39d0](https://github.com/suguru03/neo-async/commit/240d39d0))
* **queue:** remove `thisArg` from `queue` and `priorityQueue` ([f49536e2](https://github.com/suguru03/neo-async/commit/f49536e2))
* **reduce:** remove `thisArg` ([be1407a9](https://github.com/suguru03/neo-async/commit/be1407a9))
* **safe:**
  * remove unreached code ([8b64c81b](https://github.com/suguru03/neo-async/commit/8b64c81b))
  * remove `thisArg` from safe functions ([93765faa](https://github.com/suguru03/neo-async/commit/93765faa))
* **series:** remove `thisArg` ([e5a09c9b](https://github.com/suguru03/neo-async/commit/e5a09c9b))
* **sortBy:** remove `thisArg` ([4fb90fd3](https://github.com/suguru03/neo-async/commit/4fb90fd3))
* **times:** remove `thisArg` ([d3b78113](https://github.com/suguru03/neo-async/commit/d3b78113))
* **transform:** remove `thisArg` ([afe2d626](https://github.com/suguru03/neo-async/commit/afe2d626))
* **whilist:** remove `thisArg` from `whilst` and `until` ([03d10ec8](https://github.com/suguru03/neo-async/commit/03d10ec8))


#### Other Changes

* Merge branch 'v1.3.x' ([910d66cb](https://github.com/suguru03/neo-async/commit/910d66cb))
* **CHANGELOG:** v1.3.2 [ci skip] ([bc48f2e3](https://github.com/suguru03/neo-async/commit/bc48f2e3))
* **README:** update async version ([ef9f3e17](https://github.com/suguru03/neo-async/commit/ef9f3e17))
* **doWhilst:** improve performance of `doWhilst` and `doUntil` ([7d4bbf56](https://github.com/suguru03/neo-async/commit/7d4bbf56))
* **jshint:** add `-W018` option [ci skip] ([a3216d5b](https://github.com/suguru03/neo-async/commit/a3216d5b))

<a name"v1.3.2"></a>
### v1.3.2 (2015-08-04)


#### Bug Fixes

* **asyncify:** fix reserved word ([fae9f888](https://github.com/suguru03/neo-async/commit/fae9f888))
* **filter:** fix bug of `async.filter` and `async.reject` ([029a042d](https://github.com/suguru03/neo-async/commit/029a042d))

<a name"v1.3.1"></a>
### v1.3.1 (2015-07-28)


#### Features

* **asyncify:** fix to apply promise ([28ee06aa](https://github.com/suguru03/neo-async/commit/28ee06aa))
* **timesSeries:** fix to avoid stack overflow ([ec62f04c](https://github.com/suguru03/neo-async/commit/ec62f04c))


#### Other Changes

* **CHANGELOG:** v1.3.0 [ci skip] ([38dc4522](https://github.com/suguru03/neo-async/commit/38dc4522))
* **detect:** refactor `detect`, `detectSeries` and `detectLimit` ([963e33b1](https://github.com/suguru03/neo-async/commit/963e33b1))
* **each:** refactor `each`, `eachSeries` and `eachLimit` ([d0021181](https://github.com/suguru03/neo-async/commit/d0021181))
* **filter:** refactor `filter`, `filterSeries` and `filterLimit` ([c94a4678](https://github.com/suguru03/neo-async/commit/c94a4678))
* **map:** refactor `map`, `mapSeries` and `mapLimit` ([c167ad4a](https://github.com/suguru03/neo-async/commit/c167ad4a))
* **mapValues:** refactor `mapValues` and `mapValuesLimit` ([ce5cb854](https://github.com/suguru03/neo-async/commit/ce5cb854))
* **parallel:**
  * refactor `parallel` ([68d9a112](https://github.com/suguru03/neo-async/commit/68d9a112))
  * fix document ([22350338](https://github.com/suguru03/neo-async/commit/22350338))
* **travis:** fix iojs version ([63131e80](https://github.com/suguru03/neo-async/commit/63131e80))

<a name"v1.3.0"></a>
## v1.3.0 (2015-07-15)


#### Bug Fixes

* **safe:** fix safe waterfall ([a49e2203](https://github.com/suguru03/neo-async/commit/a49e2203))
* **waterfall:** fix to throw error if dobule callback ([a5f4c0f0](https://github.com/suguru03/neo-async/commit/a5f4c0f0))


#### Features

* **asyncify:** add `asyncify` method ([84cd37fe](https://github.com/suguru03/neo-async/commit/84cd37fe))
* **constant:** add `constant` method ([a465aebc](https://github.com/suguru03/neo-async/commit/a465aebc))
* **doDuring:** add `doDuring` method ([63885d01](https://github.com/suguru03/neo-async/commit/63885d01))
* **during:** add `during` method ([a0ebe031](https://github.com/suguru03/neo-async/commit/a0ebe031))
* **eachOf:** add `eachOf` aliases ([febdb6c2](https://github.com/suguru03/neo-async/commit/febdb6c2))
* **ensureAsync:** add `ensureAsync` method ([b6c6bfbf](https://github.com/suguru03/neo-async/commit/b6c6bfbf))


#### Other Changes

* **CHANGELOG:**
  * fix url path [ci skip] ([a39174f2](https://github.com/suguru03/neo-async/commit/a39174f2))
  * v1.2.1 [ci skip] ([a5fa1ece](https://github.com/suguru03/neo-async/commit/a5fa1ece))
* **EventEmitter:**
  * fix test case for coverage ([1725cb94](https://github.com/suguru03/neo-async/commit/1725cb94))
  * fix `EventEmitter` to apply asynchronos calling ([e469c907](https://github.com/suguru03/neo-async/commit/e469c907))
* **README:**
  * update speed comparison result ([e5764f34](https://github.com/suguru03/neo-async/commit/e5764f34))
  * update README.md ([00a0a539](https://github.com/suguru03/neo-async/commit/00a0a539))
* **angelFall:**
  * add `async.nextTick` ([a0aefb2d](https://github.com/suguru03/neo-async/commit/a0aefb2d))
  * refactor `angelFall` to improve performance ([9f2d0530](https://github.com/suguru03/neo-async/commit/9f2d0530))
* **apply:** improve performance ([366f6643](https://github.com/suguru03/neo-async/commit/366f6643))
* **applyEach:** improve performance ([279dd0d5](https://github.com/suguru03/neo-async/commit/279dd0d5))
* **benchmark:** add `benchmark.js` to check performance ([db835138](https://github.com/suguru03/neo-async/commit/db835138))
* **changelog:** fix gulp tasks [ci skip] ([8546953f](https://github.com/suguru03/neo-async/commit/8546953f))
* **concat:** refactor `concat` to improve performance ([2d516fa3](https://github.com/suguru03/neo-async/commit/2d516fa3))
* **concatLimit:**
  * add `async.nextTick` ([ea4f6377](https://github.com/suguru03/neo-async/commit/ea4f6377))
  * refactor `concatLimit` ([6f5790a5](https://github.com/suguru03/neo-async/commit/6f5790a5))
* **concatSeries:**
  * add `async.nextTick` ([3119ae42](https://github.com/suguru03/neo-async/commit/3119ae42))
  * refactor `concatSeries` ([cedb2b00](https://github.com/suguru03/neo-async/commit/cedb2b00))
* **createImmediate:** reafctor `createImmedaite` ([c99eb0a8](https://github.com/suguru03/neo-async/commit/c99eb0a8))
* **detct:** refactor `detect` to improve performance ([b7ccfaff](https://github.com/suguru03/neo-async/commit/b7ccfaff))
* **detectLimit:**
  * add `async.nextTick` ([4e85421b](https://github.com/suguru03/neo-async/commit/4e85421b))
  * refactor `detectLimit` to improve performance ([5bb2c764](https://github.com/suguru03/neo-async/commit/5bb2c764))
* **detectSeries:**
  * add `async.nextTick` ([6da10fcd](https://github.com/suguru03/neo-async/commit/6da10fcd))
  * refactor `detectSeries` to improve performance ([d9ab8f11](https://github.com/suguru03/neo-async/commit/d9ab8f11))
* **doDuring:**
  * add test of `doDuring` ([71fea28a](https://github.com/suguru03/neo-async/commit/71fea28a))
  * refactor `doDuring` to improve performance ([9c83282a](https://github.com/suguru03/neo-async/commit/9c83282a))
* **doWhilst:** add `async.nextTick` ([887b7332](https://github.com/suguru03/neo-async/commit/887b7332))
* **during:** refactor `during` to improve performance ([2fac74d2](https://github.com/suguru03/neo-async/commit/2fac74d2))
* **each:** refactor `each` to improve response ([cae1e2dd](https://github.com/suguru03/neo-async/commit/cae1e2dd))
* **eachLimit:**
  * add `async.nextTick` to avoid stack overflow ([2c36032c](https://github.com/suguru03/neo-async/commit/2c36032c))
  * refactor `eachLimit` to improve performance ([eb8d8959](https://github.com/suguru03/neo-async/commit/eb8d8959))
* **eachSeries:**
  * add `async.nextTick` to avoid stack overflow ([18fd0485](https://github.com/suguru03/neo-async/commit/18fd0485))
  * refactor `eachSeries` to improve perfomance ([cefdb8d3](https://github.com/suguru03/neo-async/commit/cefdb8d3))
* **everySeries:** add test case of `everySeries` ([088744e7](https://github.com/suguru03/neo-async/commit/088744e7))
* **filter:** refactor(filter): refactor `filter` to improve performance ([55a22851](https://github.com/suguru03/neo-async/commit/55a22851))
* **filterLimit:**
  * add `async.nextTick` ([759f27b9](https://github.com/suguru03/neo-async/commit/759f27b9))
  * refactor common `filterLimit` function to improve performance ([8dea6647](https://github.com/suguru03/neo-async/commit/8dea6647))
* **filterSeries:**
  * add `async.nextTick` ([6dd2731d](https://github.com/suguru03/neo-async/commit/6dd2731d))
  * refactor common `filterSeries` function to improve response ([03cf144c](https://github.com/suguru03/neo-async/commit/03cf144c))
* **forever:**
  * add `async.nextTick` ([5011b516](https://github.com/suguru03/neo-async/commit/5011b516))
  * fix to throw error if callack is not set ([faccab7f](https://github.com/suguru03/neo-async/commit/faccab7f))
* **map:** refactor `map` to improve performance ([a44b1172](https://github.com/suguru03/neo-async/commit/a44b1172))
* **mapLimit:**
  * add `async.nextTick` ([7ced4b7c](https://github.com/suguru03/neo-async/commit/7ced4b7c))
  * refactor `mapLimit` ([d089216d](https://github.com/suguru03/neo-async/commit/d089216d))
* **mapSeries:**
  * add `async.nextTick` ([0a22ebfa](https://github.com/suguru03/neo-async/commit/0a22ebfa))
  * refactor `mapSeries` ([1c56e898](https://github.com/suguru03/neo-async/commit/1c56e898))
* **mapValues:** refactor `mapValues` to improve response ([cdafd741](https://github.com/suguru03/neo-async/commit/cdafd741))
* **mapValuesLimit:**
  * fix test case ([bf0f3b65](https://github.com/suguru03/neo-async/commit/bf0f3b65))
  * add `async.nextTick` ([54e0fa8e](https://github.com/suguru03/neo-async/commit/54e0fa8e))
  * refactor `mapValuesLimit` ([0a6d2cd0](https://github.com/suguru03/neo-async/commit/0a6d2cd0))
* **mapValuesSeries:**
  * add `async.nextTick` ([50189eaf](https://github.com/suguru03/neo-async/commit/50189eaf))
  * refactor `mapValuesSeries` to improve response ([9264fafe](https://github.com/suguru03/neo-async/commit/9264fafe))
* **once:** fix not to use `called` ([3d592c4b](https://github.com/suguru03/neo-async/commit/3d592c4b))
* **other:** add test case to check whether it has `async` functions ([ac97d3c3](https://github.com/suguru03/neo-async/commit/ac97d3c3))
* **parallel:** refactor `parallel` to improve performance ([c07ca9cb](https://github.com/suguru03/neo-async/commit/c07ca9cb))
* **parallelLimit:**
  * add `async.nextTick` ([c65e2ab5](https://github.com/suguru03/neo-async/commit/c65e2ab5))
  * refactor `parallelLimit` to improve performance ([d92525ec](https://github.com/suguru03/neo-async/commit/d92525ec))
* **perf:**
  * add `during` config ([6cbf45af](https://github.com/suguru03/neo-async/commit/6cbf45af))
  * add config of `eachOf` ([3e45e87c](https://github.com/suguru03/neo-async/commit/3e45e87c))
* **pick:**
  * add `pick` test ([35b6e2f9](https://github.com/suguru03/neo-async/commit/35b6e2f9))
  * refactor `pick` to improve performance ([b7399266](https://github.com/suguru03/neo-async/commit/b7399266))
* **pickLimit:**
  * add `async.nextTick` ([e7599f1c](https://github.com/suguru03/neo-async/commit/e7599f1c))
  * refactor `pickLimit` to improve performance ([822ce6b1](https://github.com/suguru03/neo-async/commit/822ce6b1))
* **pickSeries:**
  * add `async.nextTick` ([5ba5a604](https://github.com/suguru03/neo-async/commit/5ba5a604))
  * refactor `pickSeries` to improve performance ([9ef8c84b](https://github.com/suguru03/neo-async/commit/9ef8c84b))
* **priorityQueue:** fix sort logic to improve performance ([316e480a](https://github.com/suguru03/neo-async/commit/316e480a))
* **reduce:**
  * add `async.nextTick` to `reduce` and `reduceRight` ([552fae38](https://github.com/suguru03/neo-async/commit/552fae38))
  * refactor `reduce` to improve performance ([25e114f3](https://github.com/suguru03/neo-async/commit/25e114f3))
* **reduceRight:** refactor `reduceRight` to improve performance ([a9f7a351](https://github.com/suguru03/neo-async/commit/a9f7a351))
* **reject:** refactor `reject` to improve performance ([75c70b26](https://github.com/suguru03/neo-async/commit/75c70b26))
* **rejectSeries:** add test of `rejectSeries` and `rejectLimit` ([e3737ddc](https://github.com/suguru03/neo-async/commit/e3737ddc))
* **series:**
  * add `async.nextTick` to `series` ([6a2e4ca6](https://github.com/suguru03/neo-async/commit/6a2e4ca6))
  * refactor `series` to improve performance ([25bab9a9](https://github.com/suguru03/neo-async/commit/25bab9a9))
* **some:** add test case of `someSeries` and `someLimit` ([ad0dadfb](https://github.com/suguru03/neo-async/commit/ad0dadfb))
* **sortBy:**
  * add `sortBy` tests ([f82464b7](https://github.com/suguru03/neo-async/commit/f82464b7))
  * refactor `sortBy` to improve performance ([1719180a](https://github.com/suguru03/neo-async/commit/1719180a))
  * modify sort logic ([de96bfdc](https://github.com/suguru03/neo-async/commit/de96bfdc))
* **sortByLimit:**
  * add `async.nextTick` ([73d84b18](https://github.com/suguru03/neo-async/commit/73d84b18))
  * refactor `sortByLimit` to improve performance ([55bb37aa](https://github.com/suguru03/neo-async/commit/55bb37aa))
* **sortBySeries:**
  * add `async.nextTick` ([76aa8ac3](https://github.com/suguru03/neo-async/commit/76aa8ac3))
  * refactor `sortBySeries` to improve performance ([827abd70](https://github.com/suguru03/neo-async/commit/827abd70))
* **timesLimit:** add `async.nextTick` ([e52629f5](https://github.com/suguru03/neo-async/commit/e52629f5))
* **timesSeries:** add `async.nextTick` ([4d96f372](https://github.com/suguru03/neo-async/commit/4d96f372))
* **transform:**
  * add `transform` tests ([5572c6ce](https://github.com/suguru03/neo-async/commit/5572c6ce))
  * refactor `transform` to improve performance ([87fee9bf](https://github.com/suguru03/neo-async/commit/87fee9bf))
* **transformLimit:**
  * add `async.nextTick` ([774a73e0](https://github.com/suguru03/neo-async/commit/774a73e0))
  * refactor `transformLimit` to improve performance ([a0cde4ec](https://github.com/suguru03/neo-async/commit/a0cde4ec))
* **transformSeries:**
  * add `async.nextTick` ([2ab5b4aa](https://github.com/suguru03/neo-async/commit/2ab5b4aa))
  * refactor `transformSeries` to improve performance ([165ef1c2](https://github.com/suguru03/neo-async/commit/165ef1c2))
* **travis:** fix iojs version ([c4c8c90f](https://github.com/suguru03/neo-async/commit/c4c8c90f))
* **until:** add `async.nextTick` to `until` and `doUntil` ([b6d4ba63](https://github.com/suguru03/neo-async/commit/b6d4ba63))
* **waterfall:**
  * add `async.nextTick` ([2a369ff9](https://github.com/suguru03/neo-async/commit/2a369ff9))
  * refactor `waterfall` to improve performance ([3691a443](https://github.com/suguru03/neo-async/commit/3691a443))
* **whilst:** add `async.nextTick` ([56774886](https://github.com/suguru03/neo-async/commit/56774886))

<a name"v1.2.1"></a>
### v1.2.1 (2015-05-28)


#### Bug Fixes

* **forever:** fix `forever` to improve response ([0478de5b](https://github.com/suguru03/neo-async/commit/0478de5b))
* **jsbeautifier:** fix gulp task of jsbeautifier ([895486d4](https://github.com/suguru03/neo-async/commit/895486d4))
* **jscs:** fix gulp task of jscs ([b6a3d6a6](https://github.com/suguru03/neo-async/commit/b6a3d6a6))
* **jsdoc:**
  * fix gulp task of jsdoc ([6b1dc2d6](https://github.com/suguru03/neo-async/commit/6b1dc2d6))
  * fix `transform` document ([a194a7c8](https://github.com/suguru03/neo-async/commit/a194a7c8))
* **perf:**
  * fix gulp task of perf and test ([a876cb77](https://github.com/suguru03/neo-async/commit/a876cb77))
  * fix perf task and move files ([1aab15c8](https://github.com/suguru03/neo-async/commit/1aab15c8))
* **queue:** fix `queue` not to call the drain when task name is `0` ([de0eb48b](https://github.com/suguru03/neo-async/commit/de0eb48b))


#### Features

* **perf:**
  * add gulp task ([048f22b0](https://github.com/suguru03/neo-async/commit/048f22b0))
  * add some functions ([1d9665a1](https://github.com/suguru03/neo-async/commit/1d9665a1))
  * add common comparator ([b3ca50f8](https://github.com/suguru03/neo-async/commit/b3ca50f8))


#### Other Changes

* **changelog:** add changelog task ([1da015e6](https://github.com/suguru03/neo-async/commit/1da015e6))
* **perf:**
  * update perf config ([1b402198](https://github.com/suguru03/neo-async/commit/1b402198))
  * update perf task and config ([70f51412](https://github.com/suguru03/neo-async/commit/70f51412))
* **queue:** add check of concurency to `queue` ([b39a9497](https://github.com/suguru03/neo-async/commit/b39a9497))
* **seq:** improve `seq` performance ([cd7b8622](https://github.com/suguru03/neo-async/commit/cd7b8622))

<a name"v1.2.0"></a>
## v1.2.0 (2015-05-19)


#### Features

* **angelFall:**
  * add test case and fix document ([3c9caebb](https://github.com/suguru03/neo-async/commit/3c9caebb))
  * add `angelFall` document ([7a30c4d1](https://github.com/suguru03/neo-async/commit/7a30c4d1))
  * add function of `angelFall` ([7d256745](https://github.com/suguru03/neo-async/commit/7d256745))


#### Other Changes

* **alias:** add alias of `angelfall` ([bbfb9917](https://github.com/suguru03/neo-async/commit/bbfb9917))

<a name"v1.1.2"></a>
### v1.1.2 (2015-05-14)


#### Bug Fixes

* **filterSeries:**
  * fix `filterSeries` and add test case ([9e77ae9b](https://github.com/suguru03/neo-async/commit/9e77ae9b))
  * fix bug of `fiterSeries` ([dd31e137](https://github.com/suguru03/neo-async/commit/dd31e137))


#### Other Changes

* **test:** add `reject` test ([ec5b4660](https://github.com/suguru03/neo-async/commit/ec5b4660))

<a name"v1.1.1"></a>
### v1.1.1 (2015-05-12)


#### Bug Fixes

* **safe:**
  * fix `iterator` on safe mode ([abaa5506](https://github.com/suguru03/neo-async/commit/abaa5506))
  * fix `safe` for min file ([14c5827e](https://github.com/suguru03/neo-async/commit/14c5827e))


#### Other Changes

* user latest codecov package ([e82db2a9](https://github.com/suguru03/neo-async/commit/e82db2a9))
* **test:**
  * add `safe` test ([e5bc457b](https://github.com/suguru03/neo-async/commit/e5bc457b))
  * add min test ([39891032](https://github.com/suguru03/neo-async/commit/39891032))

<a name"v1.1.0"></a>
## v1.1.0 (2015-05-09)


#### Bug Fixes

* Fix typo ([1f5106a8](https://github.com/suguru03/neo-async/commit/1f5106a8))
* **README:**
  * fix README slightly ([206d1115](https://github.com/suguru03/neo-async/commit/206d1115))
  * fix README and remove README_ja ([5a995584](https://github.com/suguru03/neo-async/commit/5a995584))
* **safe:**
  * fix `safe` not to use apply ([c84a520a](https://github.com/suguru03/neo-async/commit/c84a520a))
  * fix to use `safeNextTick` ([e88f4be3](https://github.com/suguru03/neo-async/commit/e88f4be3))
  * fix safe of control flow ([855b78aa](https://github.com/suguru03/neo-async/commit/855b78aa))
  * fix function split ([53ebabd0](https://github.com/suguru03/neo-async/commit/53ebabd0))
* **test:** fixt test to able to use safe async ([abb9b188](https://github.com/suguru03/neo-async/commit/abb9b188))


#### Features

* **safe:**
  * add `safeWaterfall` to safe functions ([e6003c37](https://github.com/suguru03/neo-async/commit/e6003c37))
  * add `safe` to create new safe functions ([60331b8d](https://github.com/suguru03/neo-async/commit/60331b8d))
  * update safe mode for controle flow ([f898a8c1](https://github.com/suguru03/neo-async/commit/f898a8c1))
  * add feature of safe mode ([ec0ecb93](https://github.com/suguru03/neo-async/commit/ec0ecb93))


#### Other Changes

* Merge branch 'feature/safe' ([22b635d9](https://github.com/suguru03/neo-async/commit/22b635d9))
* Merge branch 'master' into feature/safe ([df1e2cb6](https://github.com/suguru03/neo-async/commit/df1e2cb6))
* **README:** add `safe` to README ([016d1e3a](https://github.com/suguru03/neo-async/commit/016d1e3a))
* **test:**
  * add safe test ([20bc53df](https://github.com/suguru03/neo-async/commit/20bc53df))
  * add safe test ([9e8586b2](https://github.com/suguru03/neo-async/commit/9e8586b2))

<a name"v1.0.1"></a>
### v1.0.1 (2015-04-30)


#### Bug Fixes

* **once:** fix error handling if callback is called twice and thrown error ([59b4bead](https://github.com/suguru03/neo-async/commit/59b4bead))
* **priorityQueue:** fix `priorityQueue` for IE10 ([ea1d7753](https://github.com/suguru03/neo-async/commit/ea1d7753))
* **sortBy:** fix array sort to improve response ([9da18e8b](https://github.com/suguru03/neo-async/commit/9da18e8b))
* **test:** fix `times` test ([2cd14bbf](https://github.com/suguru03/neo-async/commit/2cd14bbf))
* **times:** fix `times` not to use `isFinite` for IE10 ([0c9da839](https://github.com/suguru03/neo-async/commit/0c9da839))


#### Other Changes

* **test:** add `concat` test ([9e2f332a](https://github.com/suguru03/neo-async/commit/9e2f332a))

<a name"v1.0.0"></a>
## v1.0.0 (2015-04-26)


#### Bug Fixes

* Fix `filterLImit` test ([e44d774e](https://github.com/suguru03/neo-async/commit/e44d774e))
* Fix `filterLimit` bug and test ([c2e1e59f](https://github.com/suguru03/neo-async/commit/c2e1e59f))
* Fix `transformLimit` ([ee7d9126](https://github.com/suguru03/neo-async/commit/ee7d9126))
* Fix `transformSeries` ([a428df4b](https://github.com/suguru03/neo-async/commit/a428df4b))
* Fix `transform` ([e733d972](https://github.com/suguru03/neo-async/commit/e733d972))
* Fix `each` logic and test ([eb75d438](https://github.com/suguru03/neo-async/commit/eb75d438))
* Fix `pickSeries` logic ([e1fcc9c1](https://github.com/suguru03/neo-async/commit/e1fcc9c1))
* Fix logic of pick and pickSeries ([b7673192](https://github.com/suguru03/neo-async/commit/b7673192))
* Fix to use `async.nextTick` ([b1421640](https://github.com/suguru03/neo-async/commit/b1421640))
* Fix filter to improve response ([af9b1b40](https://github.com/suguru03/neo-async/commit/af9b1b40))
* Fix parallel test ([f474d7ab](https://github.com/suguru03/neo-async/commit/f474d7ab))
* **README:** fix links of function to redirect to jsdoc ([b3f90927](https://github.com/suguru03/neo-async/commit/b3f90927))
* **cocnatSeries:** fix `concatSeries` not to use common function ([a11b9be4](https://github.com/suguru03/neo-async/commit/a11b9be4))
* **concat:**
  * fix `concat` not to use common function ([ac15f145](https://github.com/suguru03/neo-async/commit/ac15f145))
  * fix `concat` iterators ([25b589c8](https://github.com/suguru03/neo-async/commit/25b589c8))
* **config:** fix delay config ([b84923e6](https://github.com/suguru03/neo-async/commit/b84923e6))
* **detect:** fix `detect` not to use common function ([9c5eba22](https://github.com/suguru03/neo-async/commit/9c5eba22))
* **each:** fix `each` not to use common function ([d89df238](https://github.com/suguru03/neo-async/commit/d89df238))
* **eachLimit:** fix `eachLimit` not to use common function ([ce0f061d](https://github.com/suguru03/neo-async/commit/ce0f061d))
* **filter:** fix `filter` and `reject` to use common functions ([b2cb12ee](https://github.com/suguru03/neo-async/commit/b2cb12ee))
* **filterLimit:** fix `filterLimit` and `rejectLimit` to use common function ([ede1aa37](https://github.com/suguru03/neo-async/commit/ede1aa37))
* **filterSeries:** fix `filterSeries` and `rejectSeries` to use common function ([1bf30d19](https://github.com/suguru03/neo-async/commit/1bf30d19))
* **jsdoc:**
  * fix jsdoc to use namespace ([fc72f91d](https://github.com/suguru03/neo-async/commit/fc72f91d))
  * fix jsdoc task ([6e82a808](https://github.com/suguru03/neo-async/commit/6e82a808))
  * fix gulp task of `gh-pages` ([fc7ec422](https://github.com/suguru03/neo-async/commit/fc7ec422))
* **map:**
  * fix map iterator ([09861a42](https://github.com/suguru03/neo-async/commit/09861a42))
  * fix map not to use common fucntion ([c7ca3532](https://github.com/suguru03/neo-async/commit/c7ca3532))
* **mapLimit:** fix `mapLimit` not to use common function ([30415fdf](https://github.com/suguru03/neo-async/commit/30415fdf))
* **mapSeries:** fix `mapSeries` not to use common function ([1a3682a4](https://github.com/suguru03/neo-async/commit/1a3682a4))
* **mapValues:** fix `mapValues` not to use common function ([51fd8a10](https://github.com/suguru03/neo-async/commit/51fd8a10))
* **operator:** fix operator to use `===` ([64b1daa8](https://github.com/suguru03/neo-async/commit/64b1daa8))
* **pick:**
  * fix `pick` logic ([c03e7405](https://github.com/suguru03/neo-async/commit/c03e7405))
  * fix `pick` not to use common function ([e432df92](https://github.com/suguru03/neo-async/commit/e432df92))
  * fix `pick` ([cb6c55d9](https://github.com/suguru03/neo-async/commit/cb6c55d9))
* **pickLimit:** fix `pickLimit` response ([2dc3b6c5](https://github.com/suguru03/neo-async/commit/2dc3b6c5))
* **pickSeries:** fix `pickSeries` response ([9a762fc6](https://github.com/suguru03/neo-async/commit/9a762fc6))
* **speed_test:**
  * fix the speed test not to use gc ([20a6e4ab](https://github.com/suguru03/neo-async/commit/20a6e4ab))
  * fix to compare to previous version ([262f042c](https://github.com/suguru03/neo-async/commit/262f042c))
* **test:** fix test of some collections ([e04ae743](https://github.com/suguru03/neo-async/commit/e04ae743))
* **timesLimit:** fix `timesLimit` logic ([e997b231](https://github.com/suguru03/neo-async/commit/e997b231))
* **transform:** fix `tranform` not to use common function ([a9b6903f](https://github.com/suguru03/neo-async/commit/a9b6903f))
* **waterfall:** fix `waterfall` logic not to allow double callback ([b18955fe](https://github.com/suguru03/neo-async/commit/b18955fe))


#### Other Changes

* Documentation nits. ([9306a77d](https://github.com/suguru03/neo-async/commit/9306a77d))
* Merge branch 'master' into v1.x ([62a439bd](https://github.com/suguru03/neo-async/commit/62a439bd))
* Add `pickSeries` test ([9359a878](https://github.com/suguru03/neo-async/commit/9359a878))
* Add `pick` test ([b51e33e2](https://github.com/suguru03/neo-async/commit/b51e33e2))
* Add `detect` test ([51a63107](https://github.com/suguru03/neo-async/commit/51a63107))
* Add `detectLimit` test ([824fb91a](https://github.com/suguru03/neo-async/commit/824fb91a))
* Add `detectSeries` test ([6a221a7f](https://github.com/suguru03/neo-async/commit/6a221a7f))
* Add `detect` test ([5773a600](https://github.com/suguru03/neo-async/commit/5773a600))
* Add test of `filterSeries` and `filterLimit` ([e4bfb12b](https://github.com/suguru03/neo-async/commit/e4bfb12b))
* Add test of `each` and `filter` ([37d8ab63](https://github.com/suguru03/neo-async/commit/37d8ab63))
* Enable `concatLimit` iterator to get index or key as 2rd arguments ([458b12ba](https://github.com/suguru03/neo-async/commit/458b12ba))
* Enable `concatSeries` iterator to get index or key as 2rd arguments ([d8965ace](https://github.com/suguru03/neo-async/commit/d8965ace))
* Enable `everyLimit` iterator to get index or key as 2rd arguments ([09957e21](https://github.com/suguru03/neo-async/commit/09957e21))
* Enable `everySeries` iterator to get index or key as 2rd arguments ([f09cfdae](https://github.com/suguru03/neo-async/commit/f09cfdae))
* Enable `concat` iterator to get index or key as 2rd arguments ([6c8b02fa](https://github.com/suguru03/neo-async/commit/6c8b02fa))
* Enable `every` callback to get error ([6000fec4](https://github.com/suguru03/neo-async/commit/6000fec4))
* Enable `someLimit` iterator to get index or key as 2rd arguments ([b453d467](https://github.com/suguru03/neo-async/commit/b453d467))
* Enable `someSeries` iterator to get index or key as 2rd arguments ([197c8b8f](https://github.com/suguru03/neo-async/commit/197c8b8f))
* Enable `some` iterator to get index or key as 2rd arguments ([9963c91c](https://github.com/suguru03/neo-async/commit/9963c91c))
* Enable `sortBy` iterator to get index or key as 2rd arguments ([6dfd4e40](https://github.com/suguru03/neo-async/commit/6dfd4e40))
* Enable `reduceRight` iterator to get index or key as 2rd arguments ([c6889dcb](https://github.com/suguru03/neo-async/commit/c6889dcb))
* Enable `reduce` iterator to get index or key as 2rd arguments ([d9f2eae3](https://github.com/suguru03/neo-async/commit/d9f2eae3))
* Enable `detectLimit` iterator to get index or key as 2rd arguments ([923cc347](https://github.com/suguru03/neo-async/commit/923cc347))
* Enable `detectSeries` iterator to get index or key as 2rd arguments ([4c817a05](https://github.com/suguru03/neo-async/commit/4c817a05))
* Enable `every` iterator to get index or key as 2rd arguments ([de8734ea](https://github.com/suguru03/neo-async/commit/de8734ea))
* Enable `detect` iterator to get index or key as 2rd arguments and to get 2rd cal ([db0bf937](https://github.com/suguru03/neo-async/commit/db0bf937))
* enable async.each iterator to get index or key as 2nd argument ([41550fe3](https://github.com/suguru03/neo-async/commit/41550fe3))
* Revert `each` in order to do cherry-pick ([e26d0f83](https://github.com/suguru03/neo-async/commit/e26d0f83))
* Enable `filterLimit` iterator to get index or key as 2rd arguments and to get 2r ([12ac3e4b](https://github.com/suguru03/neo-async/commit/12ac3e4b))
* Add concurrency test when queue paused and resumed ([d7fd16d1](https://github.com/suguru03/neo-async/commit/d7fd16d1))
* Enable `filterSeries` iterator to get index or key as 2rd arguments and to get 2 ([a5422295](https://github.com/suguru03/neo-async/commit/a5422295))
* Enable `filter` iterator to get index or key as 2rd arguments and to get 2rd cal ([962b71c9](https://github.com/suguru03/neo-async/commit/962b71c9))
* Enable `pickLimit` iterator to get index or key as 2rd arguments and to get 2rd  ([b720b1b7](https://github.com/suguru03/neo-async/commit/b720b1b7))
* Enable `pickSeries` iterator to get index or key as 2rd arguments and to get 2rd ([245e03ac](https://github.com/suguru03/neo-async/commit/245e03ac))
* Enable `pick` iterator to get index or key as 2rd arguments and to get 2rd callb ([83424ff2](https://github.com/suguru03/neo-async/commit/83424ff2))
* Enable `mapValuesLimit` iterator to get index or key as 2rd arguments ([8d3f411c](https://github.com/suguru03/neo-async/commit/8d3f411c))
* Enable `mapValuesSeries` iterator to get index or key as 2rd arguments ([39723d5b](https://github.com/suguru03/neo-async/commit/39723d5b))
* Refactor `map` ([f8a73451](https://github.com/suguru03/neo-async/commit/f8a73451))
* Enable `mapValues` iterator to get index or key as 2rd arguments ([0e52c65f](https://github.com/suguru03/neo-async/commit/0e52c65f))
* Enable `mapLimit` iterator to get index or key as 2rd arguments ([5191f071](https://github.com/suguru03/neo-async/commit/5191f071))
* Enable `mapSeries` iterator to get index or key as 2rd arguments ([86a1f228](https://github.com/suguru03/neo-async/commit/86a1f228))
* Enable `map` iterator to get index or key as 2rd arguments ([952a0452](https://github.com/suguru03/neo-async/commit/952a0452))
* Add dependencies badge ([ed847a9c](https://github.com/suguru03/neo-async/commit/ed847a9c))
* Enable `eachLimit` iterator to get index or key as 2rd arguments ([acc00ba0](https://github.com/suguru03/neo-async/commit/acc00ba0))
* Enable `eachSeries` iterator to get index or key as 2rd arguments ([74b9b5c9](https://github.com/suguru03/neo-async/commit/74b9b5c9))
* **README:**
  * add benchmark result to README.md ([a15d5deb](https://github.com/suguru03/neo-async/commit/a15d5deb))
  * update README.md for v1.x ([4d09b566](https://github.com/suguru03/neo-async/commit/4d09b566))
* **concat:** refactor `concat` and improve response ([4ae912bf](https://github.com/suguru03/neo-async/commit/4ae912bf))
* **concatSeries:** refactor `concatSeries` and improve response ([e5525c84](https://github.com/suguru03/neo-async/commit/e5525c84))
* **config:** add delay config for test ([cbf74989](https://github.com/suguru03/neo-async/commit/cbf74989))
* **description:** add description for jsdoc ([ace8c520](https://github.com/suguru03/neo-async/commit/ace8c520))
* **detect:** refactor `detect` and improve response ([6af0dde6](https://github.com/suguru03/neo-async/commit/6af0dde6))
* **detectSeries:** refactor `detectSeries` to improve response ([9faf372a](https://github.com/suguru03/neo-async/commit/9faf372a))
* **each:** refactor `each` ([5a5d8105](https://github.com/suguru03/neo-async/commit/5a5d8105))
* **eachLimit:** refactor `eachLimit` and improve response ([038d853c](https://github.com/suguru03/neo-async/commit/038d853c))
* **eachSeries:**
  * reafactor `eachSeries` ([872d561d](https://github.com/suguru03/neo-async/commit/872d561d))
  * refactor `eachSeries` and improve response ([523b3c77](https://github.com/suguru03/neo-async/commit/523b3c77))
* **jsdoc:**
  * add jsdoc of control flow functions ([b35a7b6c](https://github.com/suguru03/neo-async/commit/b35a7b6c))
  * add collection jsdoc ([02397b31](https://github.com/suguru03/neo-async/commit/02397b31))
  * add jsdoc of some functions ([bce0d25b](https://github.com/suguru03/neo-async/commit/bce0d25b))
  * add jsdoc of `pick` fucntion ([3af20544](https://github.com/suguru03/neo-async/commit/3af20544))
  * update jsdoc of some functions ([5f447a59](https://github.com/suguru03/neo-async/commit/5f447a59))
  * add jsdoc of `each` functions ([60e60416](https://github.com/suguru03/neo-async/commit/60e60416))
  * add jsdoc task ([f7a88323](https://github.com/suguru03/neo-async/commit/f7a88323))
* **map:** refactor `map` and improve response ([dffd1e34](https://github.com/suguru03/neo-async/commit/dffd1e34))
* **mapLimit:** refactor `mapLimit` and improve response ([c2d7785f](https://github.com/suguru03/neo-async/commit/c2d7785f))
* **mapSeries:**
  * refactor `mapSeries` to improve response ([2d460426](https://github.com/suguru03/neo-async/commit/2d460426))
  * refactor `mapSeries` and improve response ([e6fdea30](https://github.com/suguru03/neo-async/commit/e6fdea30))
* **mapValues:** refactor `mapValues` and improve response ([7327b3ee](https://github.com/suguru03/neo-async/commit/7327b3ee))
* **mapValuesSeries:** refactor `mapValuesSeries` to improve response ([e4a64a10](https://github.com/suguru03/neo-async/commit/e4a64a10))
* **once:** update `once` to improve response ([fd45a59f](https://github.com/suguru03/neo-async/commit/fd45a59f))
* **parallel:** refactor `parallel` to improve response ([95741ae3](https://github.com/suguru03/neo-async/commit/95741ae3))
* **parallelLimit:** refactor `parallelLimit` to improve response ([79f25b14](https://github.com/suguru03/neo-async/commit/79f25b14))
* **pick:** refactor `pick` and improve response ([e3607e78](https://github.com/suguru03/neo-async/commit/e3607e78))
* **pickSeries:** refactor `pickSeries` to improve response ([7020370b](https://github.com/suguru03/neo-async/commit/7020370b))
* **reduceRight:** refactor `reduceRight` to improve response ([835742c0](https://github.com/suguru03/neo-async/commit/835742c0))
* **series:** refactor `series` to improve response ([2a3ad46f](https://github.com/suguru03/neo-async/commit/2a3ad46f))
* **speed_test:** add benchmarker to gulp task ([da7b845c](https://github.com/suguru03/neo-async/commit/da7b845c))
* **test:**
  * refactor test and add `pickSeries` test ([860c03d2](https://github.com/suguru03/neo-async/commit/860c03d2))
  * add `some` test ([488bc427](https://github.com/suguru03/neo-async/commit/488bc427))
  * add `sortBy` test ([f3b477c8](https://github.com/suguru03/neo-async/commit/f3b477c8))
  * add `pickLimit` test ([ee308c35](https://github.com/suguru03/neo-async/commit/ee308c35))
* **timeSeries:** add speed test of `timesSeries` ([bfc1dd7c](https://github.com/suguru03/neo-async/commit/bfc1dd7c))
* **timesSeries:** refactor `timesSeries` to improve response ([add895fd](https://github.com/suguru03/neo-async/commit/add895fd))
* **toArray:** remove `toArray` that is not being used ([eb1c753f](https://github.com/suguru03/neo-async/commit/eb1c753f))
* **transform:** refactor `transform` and improve response ([1682be91](https://github.com/suguru03/neo-async/commit/1682be91))

<a name"v0.6.5"></a>
### v0.6.5 (2015-05-28)


#### Bug Fixes

* **queue:** fix `queue` not to call the drain when task name is `0` ([ec5f4c96](https://github.com/suguru03/neo-async/commit/ec5f4c96))

<a name"v0.6.4"></a>
### v0.6.4 (2015-04-13)


#### Bug Fixes

* Fix once bug ([a5c6cde8](https://github.com/suguru03/neo-async/commit/a5c6cde8))
* **EventEmitter:**
  * fix `RemoveEvent` and add test case ([46630c64](https://github.com/suguru03/neo-async/commit/46630c64))
  * fix `EventEmitter` logic and add prototype functions ([092d44d3](https://github.com/suguru03/neo-async/commit/092d44d3))


#### Other Changes

* Add `EventEmitter` test ([8603b3c6](https://github.com/suguru03/neo-async/commit/8603b3c6))

<a name"v0.6.3"></a>
### v0.6.3 (2015-03-13)


#### Bug Fixes

* Fix to use `async.nextTick` ([b48fcb13](https://github.com/suguru03/neo-async/commit/b48fcb13))
* Fix parallel test ([cab3d8cf](https://github.com/suguru03/neo-async/commit/cab3d8cf))


#### Other Changes

* Add concurrency test when queue paused and resumed ([71478234](https://github.com/suguru03/neo-async/commit/71478234))
* Add dependencies badge ([0ed660de](https://github.com/suguru03/neo-async/commit/0ed660de))

<a name"v0.6.2"></a>
### v0.6.2 (2015-02-26)


#### Bug Fixes

* Fix null to undefined ([371ea62e](https://github.com/suguru03/neo-async/commit/371ea62e))
* Fix not to use immediate function ([229a3511](https://github.com/suguru03/neo-async/commit/229a3511))
* Fix function of _arrayEach and _objectEach ([2873c0a8](https://github.com/suguru03/neo-async/commit/2873c0a8))
* Fix package.json and update badge ([d6924f1b](https://github.com/suguru03/neo-async/commit/d6924f1b))
* Fix code by jsbeautifier ([2033ab24](https://github.com/suguru03/neo-async/commit/2033ab24))
* Fix sortBy test ([18069b3a](https://github.com/suguru03/neo-async/commit/18069b3a))


#### Other Changes

* Add gulp task of jsbeautifier ([5d943272](https://github.com/suguru03/neo-async/commit/5d943272))
* Add gulp task of jscs ([00ba6954](https://github.com/suguru03/neo-async/commit/00ba6954))

<a name"v0.6.1"></a>
### v0.6.1 (2015-02-19)


#### Bug Fixes

* Fix limit test ([a5067115](https://github.com/suguru03/neo-async/commit/a5067115))
* Fix function definition ([337cef5c](https://github.com/suguru03/neo-async/commit/337cef5c))
* Fix limit test ([eff5b00b](https://github.com/suguru03/neo-async/commit/eff5b00b))


#### Other Changes

* Change Math.min to ternary operator ([cc4fa15a](https://github.com/suguru03/neo-async/commit/cc4fa15a))
* Update README ([9ce5e5b8](https://github.com/suguru03/neo-async/commit/9ce5e5b8))
* Add mapValues functions ([a84f7808](https://github.com/suguru03/neo-async/commit/a84f7808))
* Refactor some functions to use immediate function ([9c62a206](https://github.com/suguru03/neo-async/commit/9c62a206))

<a name"v0.6.0"></a>
## v0.6.0 (2015-02-16)


#### Bug Fixes

* Fix logic of transformLimit ([f9b6c247](https://github.com/suguru03/neo-async/commit/f9b6c247))
* Fix bug of reject and logic of pickLimit ([edfb211b](https://github.com/suguru03/neo-async/commit/edfb211b))
* Fix logic of detectLimit, everyLimit and someLimit ([ab7f4e91](https://github.com/suguru03/neo-async/commit/ab7f4e91))
* Fix logic of concatLimit ([875918f7](https://github.com/suguru03/neo-async/commit/875918f7))
* Fix logic of mapLimit ([6a2d1cd9](https://github.com/suguru03/neo-async/commit/6a2d1cd9))
* Fix logic of eachLimit ([a5aa2352](https://github.com/suguru03/neo-async/commit/a5aa2352))
* Fix logic of queue ([9cb62e12](https://github.com/suguru03/neo-async/commit/9cb62e12))
* Fix to return result of apply ([a4c3e3a4](https://github.com/suguru03/neo-async/commit/a4c3e3a4))
* Fix result of series ([b3c1984e](https://github.com/suguru03/neo-async/commit/b3c1984e))
* Fix wrong logic of parallelLimit ([c639aad2](https://github.com/suguru03/neo-async/commit/c639aad2))
* Fix waterfall for drop-in replacement ([8e2a3413](https://github.com/suguru03/neo-async/commit/8e2a3413))
* Fix issue when cause if task is not collection ([83bf5f28](https://github.com/suguru03/neo-async/commit/83bf5f28))
* Fix README ([f413c16c](https://github.com/suguru03/neo-async/commit/f413c16c))
* Fix double callback in auto ([ff3d7887](https://github.com/suguru03/neo-async/commit/ff3d7887))
* Fix bug of applyEach ([758b0de3](https://github.com/suguru03/neo-async/commit/758b0de3))
* Fix issue which occurs if tasks are not collection ([0935fade](https://github.com/suguru03/neo-async/commit/0935fade))
* Fix bug when limit is Infinity ([8376ff86](https://github.com/suguru03/neo-async/commit/8376ff86))


#### Other Changes

* Remove waterfall statistic from README_ja ([0f2d42be](https://github.com/suguru03/neo-async/commit/0f2d42be))
* Add alias which async has ([13190ae3](https://github.com/suguru03/neo-async/commit/13190ae3))
* Remove waterfall statistic from README ([467449eb](https://github.com/suguru03/neo-async/commit/467449eb))
* Add setImmediate to waterfall ([a4f5fdd1](https://github.com/suguru03/neo-async/commit/a4f5fdd1))
* Add gulp test ([0c52537e](https://github.com/suguru03/neo-async/commit/0c52537e))
* Add async test ([e37b2190](https://github.com/suguru03/neo-async/commit/e37b2190))
* Add iojs and node v0.12 to travis.yml ([43762aa3](https://github.com/suguru03/neo-async/commit/43762aa3))
* **README:** add bower usage ([8c2b0f87](https://github.com/suguru03/neo-async/commit/8c2b0f87))

<a name"v0.5.3"></a>
### v0.5.3 (2015-02-07)


#### Bug Fixes

* Fix issue if collection is null ([6fdc60b7](https://github.com/suguru03/neo-async/commit/6fdc60b7))
* Fix comparison operator ([08dc3ce2](https://github.com/suguru03/neo-async/commit/08dc3ce2))
* Fix bug of eventEmitter ([c6280a44](https://github.com/suguru03/neo-async/commit/c6280a44))
* Fix limit in times ([67810e4f](https://github.com/suguru03/neo-async/commit/67810e4f))


#### Other Changes

* Update LICENSE ([54c75878](https://github.com/suguru03/neo-async/commit/54c75878))
* Update README ([6d421754](https://github.com/suguru03/neo-async/commit/6d421754))

<a name"v0.5.2"></a>
### v0.5.2 (2015-02-05)


#### Bug Fixes

* Fix issue if limit is unexpected ([36501c2a](https://github.com/suguru03/neo-async/commit/36501c2a))
* Fix issue if collection is not array or object ([3c8fbca5](https://github.com/suguru03/neo-async/commit/3c8fbca5))

<a name"v0.5.1"></a>
### v0.5.1 (2015-02-05)


#### Bug Fixes

* Fix issue of double callback ([da6fc451](https://github.com/suguru03/neo-async/commit/da6fc451))

<a name"v0.5.0"></a>
## v0.5.0 (2015-02-02)


#### Other Changes

* Remove _forEach function ([dc6d53de](https://github.com/suguru03/neo-async/commit/dc6d53de))
* Update README ([5368d432](https://github.com/suguru03/neo-async/commit/5368d432))
* Remove multiEach ([50dd9528](https://github.com/suguru03/neo-async/commit/50dd9528))
* Modify times to respond quickly ([2aed1667](https://github.com/suguru03/neo-async/commit/2aed1667))
* Modify series, parallel and parallelLimit ([9e5409b2](https://github.com/suguru03/neo-async/commit/9e5409b2))
* Modify method of detect and pick ([cdf07e2c](https://github.com/suguru03/neo-async/commit/cdf07e2c))
* avoid creating empty function. ([ed2b426d](https://github.com/suguru03/neo-async/commit/ed2b426d))
* **bower.json:** add bower.json ([f9a62dea](https://github.com/suguru03/neo-async/commit/f9a62dea))

<a name"v0.4.9"></a>
### v0.4.9 (2015-01-29)


#### Bug Fixes

* Fix make file ([132bd9ef](https://github.com/suguru03/neo-async/commit/132bd9ef))


#### Other Changes

* Add async file to dist ([6bda9c31](https://github.com/suguru03/neo-async/commit/6bda9c31))

<a name"v0.4.8"></a>
### v0.4.8 (2015-01-25)


#### Bug Fixes

* Fix npm files ([979c8a2b](https://github.com/suguru03/neo-async/commit/979c8a2b))

<a name"v0.4.7"></a>
### v0.4.7 (2015-01-25)


#### Other Changes

* Add min file to dist ([ef4034d5](https://github.com/suguru03/neo-async/commit/ef4034d5))
* Update speed comparison ([cff27614](https://github.com/suguru03/neo-async/commit/cff27614))

<a name"v0.4.6"></a>
### v0.4.6 (2015-01-23)


#### Other Changes

* Add waterfall test ([e0b82141](https://github.com/suguru03/neo-async/commit/e0b82141))
* Modify waterfall function to respond quickly ([2d7af49c](https://github.com/suguru03/neo-async/commit/2d7af49c))

<a name"v0.4.5"></a>
### v0.4.5 (2016-01-03)


#### Bug Fixes

* Fix speed test files ([506cad96](https://github.com/suguru03/neo-async/commit/506cad96))
* Fix indexOf method and add test ([53a428a1](https://github.com/suguru03/neo-async/commit/53a428a1))


#### Other Changes

* Add test case ([d2a360f5](https://github.com/suguru03/neo-async/commit/d2a360f5))
* Modify parallelLimit function to respond quickly ([62b44ea2](https://github.com/suguru03/neo-async/commit/62b44ea2))
* Modify parallel function to respond quickly ([06c532b7](https://github.com/suguru03/neo-async/commit/06c532b7))
* Modify series function to respond quickly ([2033b22e](https://github.com/suguru03/neo-async/commit/2033b22e))
* Add concat comparison ([b0d97eb5](https://github.com/suguru03/neo-async/commit/b0d97eb5))
* Add iojs sample to README ([e7023bf9](https://github.com/suguru03/neo-async/commit/e7023bf9))

<a name"v0.4.4"></a>
### v0.4.4 (2015-01-15)


#### Bug Fixes

* Fix typo and update README.md ([0396d1e1](https://github.com/suguru03/neo-async/commit/0396d1e1))

<a name"v0.4.3"></a>
### v0.4.3 (2015-01-12)


#### Bug Fixes

* Fix jsperf of README.md ([6f7597f5](https://github.com/suguru03/neo-async/commit/6f7597f5))
* Fix versioning and add apply test ([6197534a](https://github.com/suguru03/neo-async/commit/6197534a))
* Fix async version ([7d8aded7](https://github.com/suguru03/neo-async/commit/7d8aded7))
* Fix nextTick test ([3c910a22](https://github.com/suguru03/neo-async/commit/3c910a22))


#### Other Changes

* Add jeperf comparison to README.md ([f6dabe77](https://github.com/suguru03/neo-async/commit/f6dabe77))
* Update apply for binding ([630869e4](https://github.com/suguru03/neo-async/commit/630869e4))
* Add nextTick test ([f7c78207](https://github.com/suguru03/neo-async/commit/f7c78207))
* Add nextTick test and fix console for coverage ([a4f2d082](https://github.com/suguru03/neo-async/commit/a4f2d082))
* Add logger test ([b0e0ac7c](https://github.com/suguru03/neo-async/commit/b0e0ac7c))
* Add test case for once ([e715f1b0](https://github.com/suguru03/neo-async/commit/e715f1b0))
* Add define test ([1d21c382](https://github.com/suguru03/neo-async/commit/1d21c382))
* Update README.md ([8e67c23b](https://github.com/suguru03/neo-async/commit/8e67c23b))
* Update README.md ([695020ec](https://github.com/suguru03/neo-async/commit/695020ec))
* Add waterfall sample to README.md ([6389be69](https://github.com/suguru03/neo-async/commit/6389be69))
* Add parallel, series samples to README.md ([08ec43d9](https://github.com/suguru03/neo-async/commit/08ec43d9))

<a name"v0.4.2"></a>
### v0.4.2 (2015-01-02)


#### Bug Fixes

* Fix collection of README.md ([9f2a56bb](https://github.com/suguru03/neo-async/commit/9f2a56bb))
* Fix transform to correspond to accumulator ([0988c3fc](https://github.com/suguru03/neo-async/commit/0988c3fc))


#### Other Changes

* Add collection samples to README.md ([c5fb9ef1](https://github.com/suguru03/neo-async/commit/c5fb9ef1))
* Add pick samples to README.md ([f9c95ae1](https://github.com/suguru03/neo-async/commit/f9c95ae1))
* Add map samples to README.md ([5442224f](https://github.com/suguru03/neo-async/commit/5442224f))
* Add filter samples to README.md ([8038c92c](https://github.com/suguru03/neo-async/commit/8038c92c))
* Add every samples to README.md ([c706e3a6](https://github.com/suguru03/neo-async/commit/c706e3a6))

<a name"v0.4.1"></a>
### v0.4.1 (2014-12-29)


#### Other Changes

* Refactor async.js ([1c4c4f2b](https://github.com/suguru03/neo-async/commit/1c4c4f2b))
* Add detect samples to README.md ([1a09e1bd](https://github.com/suguru03/neo-async/commit/1a09e1bd))
* Update README.md ([ddfc7c40](https://github.com/suguru03/neo-async/commit/ddfc7c40))

<a name"v0.4.0"></a>
## v0.4.0 (2014-12-28)


#### Bug Fixes

* Fix badge ([9ac98686](https://github.com/suguru03/neo-async/commit/9ac98686))
* Fix to use codecov.io ([5b63b465](https://github.com/suguru03/neo-async/commit/5b63b465))
* Fix timesSeries for quickly response ([e7415f41](https://github.com/suguru03/neo-async/commit/e7415f41))


#### Other Changes

* Add feature of eventEmitter ([d44b6ae7](https://github.com/suguru03/neo-async/commit/d44b6ae7))

<a name"v0.3.4"></a>
### v0.3.4 (2014-12-28)


#### Other Changes

* Remove feature of break in each ([9123e90c](https://github.com/suguru03/neo-async/commit/9123e90c))
* Add npm label to README.md ([c64d9417](https://github.com/suguru03/neo-async/commit/c64d9417))
* Add images to README.md ([4bd7b24d](https://github.com/suguru03/neo-async/commit/4bd7b24d))

<a name"v0.3.3"></a>
### v0.3.3 (2014-12-25)


#### Bug Fixes

* Fix transformSeries for series response ([9678659d](https://github.com/suguru03/neo-async/commit/9678659d))
* Fix type check for browser ([fb445bdd](https://github.com/suguru03/neo-async/commit/fb445bdd))
* Fix filter for quickly response ([12375652](https://github.com/suguru03/neo-async/commit/12375652))

<a name"v0.3.2"></a>
### v0.3.2 (2014-12-23)


#### Bug Fixes

* Fix transform and update speed comparison ([c45ff5da](https://github.com/suguru03/neo-async/commit/c45ff5da))


#### Other Changes

* Update speed comparison ([980b4876](https://github.com/suguru03/neo-async/commit/980b4876))
* Add each samples to README.md ([302ee2d5](https://github.com/suguru03/neo-async/commit/302ee2d5))

<a name"v0.3.1"></a>
### v0.3.1 (2014-12-21)


#### Bug Fixes

* Fix map response and add speed test ([5efc01bb](https://github.com/suguru03/neo-async/commit/5efc01bb))


#### Other Changes

* Remove functions for quickly response ([bb3c75b1](https://github.com/suguru03/neo-async/commit/bb3c75b1))
* Modify response of reduce and reduceRight ([73e15766](https://github.com/suguru03/neo-async/commit/73e15766))
* Modify response of pick, pickSeries and pickLimit ([5e9083f9](https://github.com/suguru03/neo-async/commit/5e9083f9))
* Change file path of speed test and add test of every ([ed7f7b05](https://github.com/suguru03/neo-async/commit/ed7f7b05))
* Modify response of detect, detectSeries and detectLimit ([fb908026](https://github.com/suguru03/neo-async/commit/fb908026))
* Modify response of concat and concatSeries ([30fb3c92](https://github.com/suguru03/neo-async/commit/30fb3c92))
* Modify response of each ([fd948401](https://github.com/suguru03/neo-async/commit/fd948401))
* Add map test ([e2c966af](https://github.com/suguru03/neo-async/commit/e2c966af))

<a name"v0.3.0"></a>
## v0.3.0 (2014-12-19)


#### Bug Fixes

* Fix README.md ([c4502436](https://github.com/suguru03/neo-async/commit/c4502436))


#### Other Changes

* Modify once for quickly response ([f00d1664](https://github.com/suguru03/neo-async/commit/f00d1664))
* Add test of multiEach ([052d1245](https://github.com/suguru03/neo-async/commit/052d1245))
* Add multiEach sample to README.md ([c8eae7b2](https://github.com/suguru03/neo-async/commit/c8eae7b2))
* Add multiEach function ([2ed9fea1](https://github.com/suguru03/neo-async/commit/2ed9fea1))
* Add noConflict test for coverage ([b8667ed1](https://github.com/suguru03/neo-async/commit/b8667ed1))

<a name"v0.2.11"></a>
### v0.2.11 (2014-12-15)


#### Bug Fixes

* Fix response of transform ([481765d2](https://github.com/suguru03/neo-async/commit/481765d2))
* Fix response of concat and add test ([93e54286](https://github.com/suguru03/neo-async/commit/93e54286))
* Fix test config ([26f37676](https://github.com/suguru03/neo-async/commit/26f37676))


#### Other Changes

* Add test of detect, detectSeries and detectLimit ([02a3580f](https://github.com/suguru03/neo-async/commit/02a3580f))
* Add test of each, eachSeries and eachLimit ([651e18b2](https://github.com/suguru03/neo-async/commit/651e18b2))
* Add test of map, mapSeries and mapLimit ([c67b81d4](https://github.com/suguru03/neo-async/commit/c67b81d4))
* Add test of pick, pickSereies and pickLimit ([94640fb7](https://github.com/suguru03/neo-async/commit/94640fb7))
* Update README.md ([e9deac2e](https://github.com/suguru03/neo-async/commit/e9deac2e))

<a name"v0.2.10"></a>
### v0.2.10 (2014-12-10)


#### Bug Fixes

* Fix iterator bug and add test of cargo, iterator ([3652f569](https://github.com/suguru03/neo-async/commit/3652f569))


#### Other Changes

* Add test of transform, transformSeries and transformLimit ([768a516f](https://github.com/suguru03/neo-async/commit/768a516f))

<a name"v0.2.9"></a>
### v0.2.9 (2014-12-07)


#### Bug Fixes

* Fix type check ([076a9e75](https://github.com/suguru03/neo-async/commit/076a9e75))


#### Other Changes

* Update README ([1b74c15a](https://github.com/suguru03/neo-async/commit/1b74c15a))
* Add speed test which use func-comparator ([8d1adbc4](https://github.com/suguru03/neo-async/commit/8d1adbc4))

<a name"v0.2.8"></a>
### v0.2.8 (2014-12-05)


#### Bug Fixes

* Fix typo and add test of queue ([2c07e247](https://github.com/suguru03/neo-async/commit/2c07e247))


#### Other Changes

* Add test of series and queue ([e754b13c](https://github.com/suguru03/neo-async/commit/e754b13c))

<a name"v0.2.7"></a>
### v0.2.7 (2014-12-03)


#### Other Changes

* Update package.json ([99eeec3f](https://github.com/suguru03/neo-async/commit/99eeec3f))
* Add test of times and waterfall ([517614b3](https://github.com/suguru03/neo-async/commit/517614b3))
* Add test of control flow and utilities ([b111f05d](https://github.com/suguru03/neo-async/commit/b111f05d))

<a name"v0.2.6"></a>
### v0.2.6 (2014-12-01)


#### Bug Fixes

* Fix to call function if error is caught ([f33b8b30](https://github.com/suguru03/neo-async/commit/f33b8b30))


#### Other Changes

* Add license ([ae019f21](https://github.com/suguru03/neo-async/commit/ae019f21))
* Add coveralls and budges ([d7eb1fa2](https://github.com/suguru03/neo-async/commit/d7eb1fa2))
* Add travis config ([75281985](https://github.com/suguru03/neo-async/commit/75281985))
* Add test of control flow ([5472569d](https://github.com/suguru03/neo-async/commit/5472569d))

<a name"v0.2.5"></a>
### v0.2.5 (2014-11-29)


#### Bug Fixes

* Fix clone bug and Add test of control flow ([88b8f294](https://github.com/suguru03/neo-async/commit/88b8f294))


#### Other Changes

* Modify "waterfall" to improve response speed ([5dfb4c19](https://github.com/suguru03/neo-async/commit/5dfb4c19))
* Modify slice for v8 optimization ([600790ac](https://github.com/suguru03/neo-async/commit/600790ac))

<a name"v0.2.4"></a>
### v0.2.4 (2014-11-27)


#### Other Changes

* Add repository to package.json ([dfbcf4e7](https://github.com/suguru03/neo-async/commit/dfbcf4e7))

<a name"v0.2.3"></a>
### v0.2.3 (2014-11-27)


#### Bug Fixes

* Fix bug of auto ([1ae13816](https://github.com/suguru03/neo-async/commit/1ae13816))

<a name"v0.2.2"></a>
### v0.2.2 (2014-11-25)

<a name"v0.2.1"></a>
### v0.2.1 (2014-11-25)


#### Other Changes

* Modify to be able to use "require.js" ([d7716eb0](https://github.com/suguru03/neo-async/commit/d7716eb0))
* Modify to use compacted file ([b5d94199](https://github.com/suguru03/neo-async/commit/b5d94199))

<a name"v0.2.0"></a>
## v0.2.0 (2014-11-24)


#### Other Changes

* Add test case of collections ([bd91135b](https://github.com/suguru03/neo-async/commit/bd91135b))
* Add feature of break to "each" ([1265426a](https://github.com/suguru03/neo-async/commit/1265426a))

<a name"v0.1.1"></a>
### v0.1.1 (2014-11-24)


#### Other Changes

* Update README.md ([255c462f](https://github.com/suguru03/neo-async/commit/255c462f))

