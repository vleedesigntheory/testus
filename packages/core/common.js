const fs = require('fs');
const path = require('path');

const { EXT_REG } = require('../shared');

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
    console.log('dirPath', dirPath);

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

exports.goTree = ( tree, originName, fn )  => {
    console.log('tree', tree);
    // 深度优先遍历
    const dfs = ( tree, p ) => {
        tree.forEach(t => {
            if(t.children) {
                console.log('directory', path.join(p, t.name))
                dfs(t.children, path.join(p, t.name))
            } else {
                console.log('file', path.join(p, t.name))
                t = fn(path.join(p, t.name), t)
            }
        })

        return tree;
    }

    return dfs(tree, originName)
}