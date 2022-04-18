const { program } = require('commander');

program
    .command('start')
    .description('test start')
    .action(options => {
        console.log('options', options)
        require('./packages/core')(options)
    });