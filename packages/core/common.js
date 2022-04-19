const fs = require('fs');
const path = require('path');

const { EXT_REG, compose, isFunction, error, warn, info } = require('../shared');

/**
 * 建立树的基本数据结构
 */
exports.toTree = ( dirPath, originName, extFiles, excludes ) => {
    // 绝对路径
    const _excludes = excludes.map(m => path.join(process.cwd(), '.', m));

    const recursive = (p) => {
        const r = [];
        fs.readdirSync(p, 'utf-8').forEach(item => {
            if(fs.statSync(path.join(p, item)).isDirectory()) {
                if(!_excludes.includes(path.join(p, item))) { 
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
                if(!_excludes.includes(path.join(p, item))) {
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

/**
 * 对树进行遍历并进行相关的一些函数操作
 */
exports.goTree = ( tree, originName, fn, args )  => {
    // 深度优先遍历
    const dfs = ( tree, p ) => {
        tree.forEach(t => {
            if(t.children) {
                dfs(t.children, path.join(p, t.name))
            } else {
                t = fn(path.join(p, t.name), t, args)
            }
        })

        return tree;
    }

    return dfs(tree, originName)
}

/**
 * 对树进行相关数据结构的转化
 */
exports.transTree = ( doctrine, middlewares, templateFn, relativePath ) => {
    const next = (ctx) => {
        if( ctx.tags.length > 0 ) {
            // 过滤@testus中的内容
            const positions = [];
            ctx.tags.forEach((item, index) => {
                if( item.title == 'testus' ) {
                    positions.push(index)
                }
            });
            if(positions.length % 2 == 0) {
                for(let i=0; i< positions.length-1; i+=2) {
                    // 对导出内容进行判断限定
                    const end = ctx.tags.filter(f => f.title == 'end' );
                    if( end.length > 0 ) {
                        const out = end.pop();
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
        r = next(doctrine)
    }
    
    return r;
}

/**
 * 基于树的数据结构生成相应的内容
 */
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
                fs.mkdirSync(path.join(p, t.name))
                dfs(t.children, path.join(p, t.name))
            } else {
                t.content && fs.writeFileSync(path.join(p, filterName(t.name, middleName)), t.content)
            }
        })

        return tree;
    }

    return dfs(tree, path.join(dirPath, targetName))
}