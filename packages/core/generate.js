const fs = require('fs');
const path = require('path');

const { error, done, isNil, warn } = require('../shared');

const { genTree } = require('./common');



const handleOptions = (libName, options) => {
    switch (libName) {
        case 'jest':
            createJestOptions(options);
            break;
        case 'jasmine':
            createJasmineOptions(options);
            break;
        case 'karma':
            createKarmaOptions(options);
            break;
        default:
            break;
    }
};

function createJestOptions(options) {
    const name = 'jest.config.js';
    if( fs.existsSync( path.join(path.resolve(process.cwd(), '.'), name) ) ) {
        warn(`当前根目录下存在${name}，会根据testus.config.js中的libConfig进行重写`)
    }
    const data = `module.exports = ${JSON.stringify(options)}`
    fs.writeFileSync( path.join(path.resolve(process.cwd(), '.'), `${name}`) , data )
}

function createJasmineOptions(options) {
    const name = 'jasmine.json';
    if( fs.existsSync( path.join(path.resolve(process.cwd(), '.'), name) ) ) {
        warn(`当前根目录下存在${name}，会根据testus.config.js中的libConfig进行重写`)
    } 
    const data = `${JSON.stringify(options)}`
    fs.writeFileSync( path.join(path.resolve(process.cwd(), '.'), `${name}`) , data )
}

function createKarmaOptions(options) {
    const name = 'karma.conf.js';
    if( fs.existsSync( path.join(path.resolve(process.cwd(), '.'), name) ) ) {
        warn(`当前根目录下存在${name}，会根据testus.config.js中的libConfig进行重写`)
    } 
    const data = `module.exports = function(config) {
        config.set(${JSON.stringify(options)})
    }`
    fs.writeFileSync( path.join(path.resolve(process.cwd(), '.'), `${name}`) , data )
}

module.exports = (args) => {
    // 生成批量文件
    if( fs.existsSync( path.join(path.resolve(process.cwd(), '.'), args.targetName) ) ) {
        error(`${args.targetName}文件目录已存在，请换一个测试文件导出名称或者删除${args.targetName}后再进行操作`)
        throw new Error(`${args.targetName}文件目录已存在，请换一个测试文件导出名称或者删除${args.targetName}后再进行操作`)
    } else {
        fs.mkdirSync(path.join(path.resolve(process.cwd(), '.'), args.targetName))
        genTree(args.tree, args.targetName, path.resolve(process.cwd(), '.'), args.middleName)
    }
    
    // 生成配置文件

    if(!isNil(args.options)) {
        console.log('args Options', args.options)
        handleOptions(args.libName, args.options)
    }
    done('自动生成测试文件完成')
}