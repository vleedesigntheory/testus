const commander = require('commander');

const program = commander.program;

program
    .command('start')
    .description('test start')
    .action(options => {
        console.log('options', options)
        require('./packages/core')(options)
    });