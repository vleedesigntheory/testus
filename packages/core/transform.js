/**
 * middleware的执行也是在这个阶段
 */
const doctrine = require('doctrine');

const fs = require('fs');
const path = require('path');

const { goTree, transTree } = require('./common');

const { jestTemplateFn, jasmineTemplateFn, karmaTemplateFn } = require('../testus-plugin-jest');


function handleContent(p, item, { middlewares,  libName, originName, targetName }) {
    let templateFn = jestTemplateFn;
    switch (libName) {
        case 'jest':
            templateFn = jestTemplateFn;
            break;
        case 'jasmine':
            templateFn = jasmineTemplateFn;
            break;
        case 'karma':
            templateFn = karmaTemplateFn;
            break;
        default:
            break;
    }
    const reg = new RegExp(`${originName}`);
    
    item.content = transTree(
            doctrine.parse(fs.readFileSync(p, 'utf-8'), {
                unwrap: true,
                sloppy: true,
                lineNumbers: true
            }),
            middlewares,
            templateFn,
            path.relative(p.replace(reg, targetName), p).slice(3)
    );
    return item;
}


module.exports = (args) => {
    args.tree = goTree(args.tree, args.originName, handleContent, { 
        middlewares: args.middlewares, 
        libName: args.libName,
        originName: args.originName,
        targetName: args.targetName 
    });
    return args;
}