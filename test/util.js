'use strict';

exports.createTimer = function() {

  return {

    _startTime: null,
    _diff: null,

    init: function() {

      this._startTime = null;
      this._diff = null;

      return this;
    },

    start: function () {

      this._startTime = process.hrtime();

      return this;
    },

    diff: function() {

      var diff = process.hrtime(this._startTime);
      this._diff = diff[0] * 1e9 + diff[1];
      return this._diff;
    }

  };

};

