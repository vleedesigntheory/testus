const preprocess = require('./preprocess');
const parse = require('./parse');
const transform = require('./transform');
const generate = require('./generate');

// 使用compose对函数进行组合
const { compose } = require('../shared');

module.exports = (...args) => {
   return compose(generate, transform, parse, preprocess)(...args);
}