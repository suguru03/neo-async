'use strict';

var _ = require('lodash');

var collection, iterator, tasks;

module.exports = {
  defaults: {
    avaiable: true,
    count: 100,
    times: 10000,
    functions: ['async', 'neo-async_v0', 'neo-async_v1']
  },
  'each(array)': {
    setup: function(count) {
      collection = _.shuffle(_.times(count));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'each(object)': {
    functions: ['neo-async_v0', 'neo-async_v1'],
    setup: function(count) {
      collection = _.mapValues(_.shuffle(_.times(count)));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.each(collection, iterator, callback);
    }
  },
  'eachSeries(array)': {
    setup: function(count) {
      collection = _.shuffle(_.times(count));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachSeries(collection, iterator, callback);
    }
  },
  'eachSeries(object)': {
    functions: ['neo-async_v0', 'neo-async_v1'],
    setup: function(count) {
      collection = _.mapValues(_.shuffle(_.times(count)));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachSeries(collection, iterator, callback);
    }
  },
  'eachLimit(array)': {
    setup: function(count) {
      collection = _.shuffle(_.times(count));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachLimit(collection, 4, iterator, callback);
    }
  },
  'eachLimit(object)': {
    functions: ['neo-async_v0', 'neo-async_v1'],
    setup: function(count) {
      collection = _.mapValues(_.shuffle(_.times(count)));
      iterator = function(n, callback) {
        callback();
      };
    },
    func: function(async, callback) {
      async.eachLimit(collection, 4, iterator, callback);
    }
  },
  'parallel(array)': {
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
  'parallel(object)': {
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
  'series(array)': {
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
  'series(object)': {
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
  'parallelLimit(array)': {
    setup: function(count) {
      tasks = _.times(count, function() {
        return function(done) {
          done();
        };
      });
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, 4, callback);
    }
  },
  'parallelLimit(object)': {
    setup: function(count) {
      tasks = _.mapValues(_.times(count, function() {
        return function(done) {
          done();
        };
      }));
    },
    func: function(async, callback) {
      async.parallelLimit(tasks, 4, callback);
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
