const chalk = require('chalk');

exports.log = msg => {
    console.log(msg)
}

exports.info = msg => {
    console.log(`${chalk.bgBlue.black(' INFO ')} ${msg}`)
}

exports.done = msg => {
    console.log(`${chalk.bgGreen.black(' DONE ')} ${msg}`)
}

exports.warn = msg => {
    console.warn(`${chalk.bgYellow.black(' WARN ')} ${chalk.yellow(msg)}`)
}

exports.error = msg => {
    console.error(`${chalk.bgRed(' ERROR ')} ${chalk.red(msg)}`)
}