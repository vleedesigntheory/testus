// {
//     tree: [
//         {
//             name: 'a',
//             type: 'directory',
//             content: undefined,
//             ext: undefined,
//             children: [
//                 {
//                     name: '1',
//                     type: 'file',
//                     ext: 'js',
//                     content: `const { sum1 } = require('../../src/a/1.js');

//                     test('测试sum1函数', () => {
//                         expect(sum1(1, 2)).toBe(3);
//                     });`,
//                     children: null
//                 }
//             ]
//         },
//         {
//             name: 'b',
//             type: 'directory',
//             content: undefined,
//             ext: undefined,
//             children: [
//                 {
//                     name: 'c',
//                     type: 'directory',
//                     content: undefined,
//                     ext: undefined,
//                     children: [
//                         {
//                             name: '1',
//                             type: 'file',
//                             ext: 'js',
//                             content: `const { sum1 } = require('../../src/a/1.js');

//                             test('测试sum1函数', () => {
//                                 expect(sum1(1, 2)).toBe(3);
//                             });`,
//                             children: null
//                         }
//                     ]
//                 },
//                 {
//                     name: 'd',
//                     type: 'directory',
//                     content: undefined,
//                     ext: undefined,
//                     children: [
//                         {
//                             name: 'e',
//                             type: 'directory',
//                             content: undefined,
//                             ext: undefined,
//                             children: [
//                                 {
//                                     name: '4',
//                                     type: 'file',
//                                     ext: 'js',
//                                     content: '',
//                                     children: null
//                                 },
//                                 {
//                                     name: '5',
//                                     type: 'file',
//                                     ext: 'js',
//                                     content: '',
//                                     children: null
//                                 }
//                             ]
//                         },
//                         {
//                             name: '3',
//                             type: 'file',
//                             content: '',
//                             ext: 'js',
//                             children: null
//                         }
//                     ]
//                 },
//             ]
//         },
//     ],
//     targetName: 'tests',
//     middleName: 'spec',
//     libName: 'jest',
//     options: {

//     },
//     middlewares: [

//     ]
// };

/**
 * middleware的执行也是在这个阶段
 */
const doctrine = require('doctrine');

const fs = require('fs');
const path = require('path');

const { goTree, transTree } = require('./common');

const { jestTemplateFn, jasmineTemplateFn, karmaTemplateFn } = require('../testus-plugin-jest');


function handleContent(p, item, { middlewares,  libName, originName, targetName }) {
    console.log('相对路径', p)
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
    console.log('reg', reg, p.replace(reg, targetName))
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
    // console.log('transform', args);
    args.tree = goTree(args.tree, args.originName, handleContent, { 
        middlewares: args.middlewares, 
        libName: args.libName,
        originName: args.originName,
        targetName: args.targetName 
    });
    return args;
}