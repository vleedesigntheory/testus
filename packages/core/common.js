const fs = require('fs');
const path = require('path');

const { EXT_REG, compose, isFunction, error, warn, info } = require('../shared');

/**
 DSL = {
        tree: [
            {
                name: 'a',
                type: 'directory',
                content: undefined,
                ext: undefined,
                children: [
                    {
                        name: '1',
                        type: 'file',
                        ext: 'js',
                        content: '',
                        children: null
                    }
                ]
            },
            {
                name: 'b',
                type: 'directory',
                content: undefined,
                ext: undefined,
                children: [
                    {
                        name: 'c',
                        type: 'directory',
                        content: undefined,
                        ext: undefined,
                        children: [
                            {
                                name: '1',
                                type: 'file',
                                ext: 'js',
                                content: '',
                                children: null
                            }
                        ]
                    },
                    {
                        name: 'd',
                        type: 'directory',
                        content: undefined,
                        ext: undefined,
                        children: [
                            {
                                name: 'e',
                                type: 'directory',
                                content: undefined,
                                ext: undefined,
                                children: [
                                    {
                                        name: '4',
                                        type: 'file',
                                        ext: 'js',
                                        content: '',
                                        children: null
                                    },
                                    {
                                        name: '5',
                                        type: 'file',
                                        ext: 'js',
                                        content: '',
                                        children: null
                                    }
                                ]
                            },
                            {
                                name: '3',
                                type: 'file',
                                content: '',
                                ext: 'js',
                                children: null
                            }
                        ]
                    },
                ]
            },
        ],
        originName: 'src',
        targetName: 'tests',
        middleName: 'spec',
        libName: 'jest',
        options: {

        },
        middlewares: [

        ]
    };
 */

exports.toTree = ( dirPath, originName, extFiles, excludes ) => {
    // console.log('dirPath', dirPath);

    const recursive = (p) => {
        const r = [];
        fs.readdirSync(p, 'utf-8').forEach(item => {
            if(fs.statSync(path.join(p, item)).isDirectory()) {
                if(!excludes.includes(path.join(p, item))) { 
                    const obj = {
                        name: item,
                        type: 'directory',
                        content: undefined,
                        ext: undefined,
                        children: []
                    };
                    obj.children = recursive(path.join(p, item)).flat();
                    r.push(obj);
                }
            } else {
                if(!excludes.includes(path.join(p, item))) {
                    r.push({
                        name: item,
                        type: 'file',
                        content: '',
                        ext: item.match(EXT_REG)[1],
                        children: null
                    })
                }
            }
        });

        return r;
    }
    
    return recursive(dirPath);
}

exports.goTree = ( tree, originName, fn, args )  => {
    // console.log('tree', tree);
    // 深度优先遍历
    const dfs = ( tree, p ) => {
        tree.forEach(t => {
            if(t.children) {
                // console.log('directory', path.join(p, t.name))
                dfs(t.children, path.join(p, t.name))
            } else {
                // console.log('file', path.join(p, t.name))
                t = fn(path.join(p, t.name), t, args)
            }
        })

        return tree;
    }

    return dfs(tree, originName)
}

exports.transTree = ( doctrine, middlewares, templateFn, relativePath ) => {
    // console.log('doctrine', doctrine);
    const next = (ctx) => {
        // console.log('ctx', ctx);
        if( ctx.tags.length > 0 ) {
            // 过滤@testus中的内容
            const positions = [];
            ctx.tags.forEach((item, index) => {
                if( item.title == 'testus' ) {
                    positions.push(index)
                }
            });
            // console.log('positions', positions);
            if(positions.length % 2 == 0) {
                for(let i=0; i< positions.length-1; i+=2) {
                    // 对导出内容进行判断限定
                    const end = ctx.tags.filter(f => f.title == 'end' );
                    if( end.length > 0 ) {
                        const out = end.pop();
                        // console.log('out', out.description)
                        if( out.description.indexOf('exports') == '-1' ) {
                            warn(`目前仅支持Common JS模块导出`)
                        } else {
                            if(out.description.indexOf('module.exports') != '-1') {
                                info(`使用module.exports请将内容放置在{}中`)
                            }
                        }
                    } else {
                        error(`未导出所需测试的内容`);
                        throw new Error(`未导出所需测试的内容`)
                    }
                    
                    return templateFn(ctx.tags.slice(positions[i]+1,positions[i+1]), relativePath)
                }
            } else {
                const errorMsg = `注释不闭合，请重新填写`;
                error(errorMsg);
                throw new Error(errorMsg)
            }
            
        }
    }
    let r = '';
    if(middlewares.length > 0) {
        middlewares.forEach( middleware => {
            if(isFunction(middleware)) {
                r = middleware(doctrine, next) 
            } else {
                error(`${middleware}不是一个函数`)
            }
        });
    } else  {
        // console.log('next(doctrine)', next(doctrine));
        r = next(doctrine)
    }
    
    return r;
}

exports.genTree = ( tree, targetName, dirPath, middleName ) => {
    // 过滤名字
    const filterName = ( name, middleName ) => {
        const r = name.split('.');

        r.splice(r.length - 1,0, middleName)    

        return r.join('.')
    }

    const dfs = ( tree, p ) => {
        tree.forEach(t => {
            if(t.children) {
                // console.log('directory', path.join(p, t.name))
                fs.mkdirSync(path.join(p, t.name))
                // done(`目录路径下${p}目标文件夹${t.name}创建完成`)
                dfs(t.children, path.join(p, t.name))
            } else {
                // console.log('file', path.join(p, t.name))
                t.content && fs.writeFileSync(path.join(p, filterName(t.name, middleName)), t.content)
            }
        })

        return tree;
    }

    return dfs(tree, path.join(dirPath, targetName))
}