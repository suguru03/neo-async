/* global it */
'use strict';

var _it = typeof Map === 'function' ? it : it.skip;
_it.only = _it.only || function skipOnly(key) {
  it.only(key);
};

exports.it = _it;
