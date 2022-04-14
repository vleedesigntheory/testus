/**
 * 用于从根目录下读取testus.config.js配置文件，如果没有走默认配置
 */
const path = require('path');
const fs = require('fs');
const { error, info, TEST_LIBRARIES, DEFAULT_TESTUSCONFIG, extend, clone, FILENAME_REG, isNil, isFunction } = require('../shared');

const { toTree } = require('./common');

// 默认只能在根路径下操作
const rootDir = path.resolve(process.cwd(), '.');

const createDSL = (options) => {
    // TODO 执行命令的options
    if(fs.existsSync(`${rootDir}/testus.config.js`)) {
        const testusConfig = eval(fs.readFileSync(`${rootDir}/testus.config.js`, 'utf-8'));
        return handleConfig(testusConfig);
    } else {
        return handleConfig(DEFAULT_TESTUSCONFIG)
    }
}


function handleConfig(config) {
    const DSL = {};

    config.entry && extend(DSL, processEntry(config.entry || DEFAULT_TESTUSCONFIG.entry));
    config.output && extend(DSL, processOutput(config.output || DEFAULT_TESTUSCONFIG.output));
    config.options && extend(DSL, processOptions(config.options || DEFAULT_TESTUSCONFIG.options));
    config.plugins && extend(DSL, processPlugins(config.plugins || DEFAULT_TESTUSCONFIG.plugins));

    return DSL;
}

function processEntry(entry) {
    const entryObj = {
        tree: [],
        originName: ''
    };
    if(entry.dirPath) {
        if(fs.existsSync(path.join(rootDir, entry.dirPath))) {
            entryObj.originName = entry.dirPath;
            entryObj.tree = toTree(path.join(rootDir, entry.dirPath), entry.dirPath ,entry.extFiles || [], entry.excludes || []);
        } else {
            error(`${entry.dirPath}目录不存在，请重新填写所需生成测试文件目录`)
            throw new Error(`${entry.dirPath}目录不存在，请重新填写所需生成测试文件目录`)
        }
    }

    return entryObj;
}

function processOutput(output) {
    const outputObj = {
        targetName: '',
        middleName: ''
    };
    if(output.dirPath) {
        if( fs.existsSync( path.join(rootDir, output.dirPath) ) ) {
            error(`${output.dirPath}目录已存在，请换一个测试文件导出名称或者删除${output.dirPath}`)
            throw new Error(`${output.dirPath}目录已存在，请换一个测试文件导出名称或者删除${output.dirPath}`)
        } else {
            outputObj.targetName = output.dirPath
        }
    }
    if(output.middleName) {
        if(FILENAME_REG.test(output.middleName)) {
            error(`中间名称不能包含【\\\\/:*?\"<>|】这些非法字符`);
            throw new Error(`中间名称不能包含【\\\\/:*?\"<>|】这些非法字符`);
        } else {
            outputObj.middleName = output.middleName;
        }
    }
    return outputObj;
}

function processOptions(options) {
    const optionsObj = {
        libName: '',
        options: {}
    };
    if(options.libName) {
        if(!TEST_LIBRARIES.includes(options.libName)) {
            error(`暂不支持${options.libName}的测试库，请从${TEST_LIBRARIES.join('、')}中选择一个填写`)
            throw new Error(`暂不支持${options.libName}的测试库，请从${TEST_LIBRARIES.join('、')}中选择一个填写`)
        } else {
            optionsObj.libName = options.libName
        }
    }

    if(options.libConfig) {
        if(!isNil(options.libConfig)) {
            optionsObj.options = clone(options.libConfig)
        }
    }

    return optionsObj;
}

function processPlugins(plugins) {
    const pluginsObj = {
        middlewares: []
    };

    if(plugins) {
        if(plugins.length > 0) {
            // 判断是否是函数
            plugins.forEach(plugin => {
                if(!isFunction(plugin)) {
                    error(`${plugin}不是一个函数，请重新填写插件`)
                } else {
                    pluginsObj.middlewares.push(plugin)
                }
            })
        }
    };

    return pluginsObj;
}

module.exports = (...options) => {
    console.log('preprocess', options);

    return createDSL(options)
}
