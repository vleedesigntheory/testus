# core

主要包含 preprocess(预解析)、parse(解析)、transform(转换)、generate(生成) 四个模块

## preprocess

通过预解析`testus.config.js`用于生成核心的DSL

```js
const DSL = {
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
```
## parse

基于DSL解析对应树中的文件内容

## transform

基于DSL，使用doctrine解析注释内容及生成对应模板，对文件内容进行转化改写

## generate

基于DSL进行相应文件夹及文件的生成

