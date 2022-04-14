exports.isNil = obj => JSON.stringify(obj) === '{}';

exports.isFunction = fn => typeof fn === 'function';