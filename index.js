const { program } = require('commander');

// program
//     .command('start')
//     .description('test start')
//     .action(options => {
//         console.log('options', options)
//         require('./packages/core/index.js')(options)
//     });

// program.parse(process.argv);

require('./packages/core/index.js')()