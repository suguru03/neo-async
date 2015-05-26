'use strict';

var _ = require('lodash');

var limit = 4;
var collection, iterator, tasks;

module.exports = {
  defaults: {
    avaiable: true,
    count: 100,
    times: 50000,
    functions: ['async', 'neo-async_v0', 'neo-async_v1']
  },
  'each:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'each:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'each:object:arg3': {
    functions: [0, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, key, callback) {
        callback();
      };
    },
    func: {
      async: function(async, callback) {
        async.forEachOf(collection, iterator, callback); // not use only_once
      },
      'neo-async_v1': function(async, callback) {
        async.each(collection, iterator, callback);
      }
    }
  },
  'eachSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachSeries(collection, iterator, callback);
    }
  },
  'eachSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachSeries(collection, iterator, callback);
    }
  },
  'eachLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachLimit(collection, limit, iterator, callback);
    }
  },
  'eachLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachLimit(collection, limit, iterator, callback);
    }
  },
  'map:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.map(collection, iterator, callback);
    }
  },
  'map:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.map(collection, iterator, callback);
    }
  },
  'mapSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapSeries(collection, iterator, callback);
    }
  },
  'mapSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapSeries(collection, iterator, callback);
    }
  },
  'mapLimit:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapLimit(collection, limit, iterator, callback);
    }
  },
  'mapLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(null, n);
      };
    },
    func: function(async, callback) {
      async.mapLimit(collection, limit, iterator, callback);
    }
  },
  'filter:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.filter(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filter:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.filter(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterSeries:array': {
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.filterSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterSeries:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.filterSeries(collection, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterLimit:array': {
    functions: [1, 2],
    setup: function(count) {
      collection = createArrayCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.filterLimit(collection, limit, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'filterLimit:object': {
    functions: [1, 2],
    setup: function(count) {
      collection = createObjectCollection(count);
      iterator = function(n, callback) {
        callback(true);
      };
    },
    func: function(async, callback) {
      async.filterLimit(collection, 4, iterator, function(res) {
        callback(null, res);
      });
    }
  },
  'parallel:array': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.parallel(tasks, callback);
    }
  },
  'parallel:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function() {
        return function(done) {
          done();
        };
      }));
    },
    func: function(async, callback) {
      async.parallel(tasks, callback);
    }
  },
  'series:array': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.series(tasks, callback);
    }
  },
  'series:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function() {
        return function(done) {
          done();
        };
      }));
    },
    func: function(async, callback) {
      async.series(tasks, callback);
    }
  },
  'parallelLimit:array': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, limit, callback);
    }
  },
  'parallelLimit:object': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function() {
        return function(done) {
          done();
        };
      }));
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, limit, callback);
    }
  },
  'waterfall': {
    setup: function(count) {
      tasks = _.times(count, function(n) {
        if (!n) {
          return function(done) {
            done(null, n);
          };
        }
        return function(arg, done) {
          done(null, n);
        };
      });
    },
    func: function(async, callback) {
      async.waterfall(tasks, callback);
    }
  }
};

function createArrayCollection(count) {
  return _.shuffle(_.times(count));
}

function createObjectCollection(count) {
  return _.mapValues(_.shuffle(_.times(count)));
}
