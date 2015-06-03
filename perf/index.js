'use strict';

var argv = require('minimist')(process.argv.slice(2));

var benchmark = argv.b || argv.benchmark; // ['benchmark', 'func-comparator'], -b func-comparator
var conf = argv.c || argv.config; // -c <path>
var target = argv.t || argv.target; // -t <function name>

var basePath = process.env.PWD;

var aysnc = require('../');
var benchmarks = [
  'benchmark',
  'func-comparator'
];
