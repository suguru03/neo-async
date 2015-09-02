'use strict';

if (typeof Symbol !== 'function') {
  global.Symbol = function() {};
  global.Symbol.iterator = 'symbol';
}

module.exports = {
  delay: process.env.DELAY || 70
};
