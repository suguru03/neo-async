/* global it, describe */
'use strict';

var assert = require('assert');

var async = require('../../');
var delay = require('../config').delay;
var util = require('../util');
describe('#ReverseArray', function() {



  it('should be exact opposite to each other', function(done) {
    let arr=Array.from({length: 100}, () => Math.floor(Math.random() * 100));
    let rarr=async.ReverseArray(arr);

    for(let i=0;i<arr.length;i++)
    {
        assert.equal(arr[i],rarr[rarr.length-1-i]);
    }
    done();


  });

  it("should unshift",function(done)
    {
      let rarr=async.ReverseArray([]);
      for(let i=100;i>=0;i--)
        rarr.unshift(i);
      for(let i=0;i<=100;i++)
        assert.equal(i,rarr[i]);
      done();

    }
  );

  it("should shift",function(done) {
    let arr=Array.from({length:100});
    let rarr=async.ReverseArray(arr);
    for(let i=0;i<100;i++)
      rarr.shift();
    assert.equal(rarr.length,0)
    done();
  });

  it("should pop, slowly",function(done) {
    let arr=Array.from({length:100}); // on this data-structure pop is the expensive side!!!!
    let rarr=async.ReverseArray(arr);
    for(let i=0;i<100;i++)
      rarr.pop();
    assert.equal(rarr.length,0)
    done();
  });

  it("pop",function(done) {
    let arr=Array.from({length: 100}, () => Math.floor(Math.random() * 100));
    let rarr=async.ReverseArray(arr);

    const someNumber = 1113;
    rarr.push(someNumber);
    assert.equal(rarr[rarr.length-1],someNumber)
    done();
  });
});
