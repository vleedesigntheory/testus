const { program } = require('commander');

program
    .command('start')
    .description('test start')
    .action(options => {
        require('./packages/core')(options)
    });