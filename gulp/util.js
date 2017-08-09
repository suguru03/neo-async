'use strict';

const cp = require('child_process');

const _ = require('lodash');
const Aigle = require('aigle');

module.exports = { exec, spawn };

function exec(command, args) {
  command = !args ? command : _.reduce(args, (str, arg) => `${str} ${arg}`, command);
  return execute(cp.exec, command);
}

function spawn(name, args) {
  return execute(cp.spawn, name, args);
}

function execute(func, command, args) {
  return new Aigle((resolve, reject) => {
    let result = '';
    const task = func(command, args);
    task.on('close', err => err ? reject(err) : resolve(result));
    task.on('error', reject);
    task.stdout.on('data', data => result += `${data}`);
  });
}
