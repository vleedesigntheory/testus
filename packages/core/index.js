const preprocess = require('./preprocess');
const parse = require('./parse');
const transform = require('./transform');
const generate = require('./generate');

module.exports = (...args) => {
    return generate(
        transform(
            parse(
                preprocess(...args)
            )
        )
    )
}