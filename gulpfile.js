'use strict';

require('./test/config');

var requireDir = require('require-dir');

requireDir('./gulp/tasks', { recurse: true });
