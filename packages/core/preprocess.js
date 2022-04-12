/**
 * 用于从根目录下读取testus.config.js配置文件，如果没有走默认配置
 */
const path = require('path');
const fs = require('fs');
const { error, info, TEST_LIBRARIES, DEFAULT_TESTUSCONFIG } = require('../shared');

const rootDir = path.resolve(process.cwd(), '.');

if(fs.existsSync(`${rootDir}/testus.config.js`)) {
    const testusConfig = eval(fs.readFileSync(`${rootDir}/testus.config.js`, 'utf-8'));
    handleConfig(testusConfig);
} else {
    handleConfig(DEFAULT_TESTUSCONFIG)
}

function handleConfig(config) {
    config.entry && processEntry(config.entry);
    config.output && processOutput(config.output);
    config.options && processOptions(config.options);
    config.plugins && processPlugins(config.plugins);
}

function processEntry(entry) {
    if(entry.dirPath) {
        if(fs.existsSync(`${rootDir}/${entry.dirPath}`)) {
            
        } else {
            error(`${entry.dirPath}目录不存在，请重新填写所需生成测试文件目录`)
        }
    }
}

function processOutput(output) {
    if(output.dirPath) {
        if(fs.existsSync(`${rootDir}/${out.dirPath}`)) {
            error(`${output.dirPath}目录已存在，请换一个测试文件导出名称或者删除${output.dirPath}`)
        }
    }
    if(output.filename) {
        
    }
}

function processOptions(options) {
    if(options.libName) {
        if(!TEST_LIBRARIES.includes(options.libName)) error(`暂不支持${options.libName}的测试库，请从${TEST_LIBRARIES.join('、')}中选择一个填写`)
    }
}

function processPlugins(plugins) {
    if(options.plugins) {
        
    }
}

module.exports = (...args) => {
    
}
