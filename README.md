<p align="center"><a href="https://github.com/veeui/vee-testus#readme" target="_blank"><img src="./docs/assets/testus.png" width="100"></a></p>

<h2 align="center">TestUS</h2>

<hr/>

## Introduction

> A Test Kit for Vee

[testus](https://github.com/veeui/vee-testus#readme) is a Test Kit in Front End, which can help Developers to TEST your own projects. We concern multiple kinds of tests, such as Unit Test, Integration Test and E2E Test (UI Test), which can cover most of your test case for Front End.
## Feature

1. Support parse notation to get what you wanna test;

2. Support ``testus.config.js`` to customize your own options;

3. Support vscode icons for ``testus.config.js`` to beautify your IDE;

4. Support cli plugin to perform your Develop Experience. Officially, we only support plugin for our own cli but you can customize your plugin which we expose a plugin api.

## Installation

> npm install testus

## Quick Start

In your root directory, you'd better to create a `testus.config.js`. If we can't find `testus.config.js` in your root directory, we set a default configuration:

```js
module.exports = {
    entry: {
        // path which you want to observe based to the root directory
        dirPath: '',
        // what types file you want to watch
        extFiles: ['js'],
        // file or directory which you want to ignore
        excludes: [],
    },
    output: {
        // path which you want to export based to the root directory
        dirPath: 'tests',
        // you want to generate a test file whose middle name you want to define
        middleName: 'spec',
    },
    options: {
        // test libraries you want to test, which supports jest, jasmine and karma right now
        libName: 'jest',
        // test libraries' config, such as jest.config.js, jasmine.config.json and karma.conf.js
        libConfig: {

        }
    },
    // plugin should be a function, which must return a next(ctx) in your plugin params, such as: (ctx, next) => next(ctx)
    plugins: [

    ]
}
```

## Plugins

|Project|Description|
|:-:|:-:|
|testus-plugin-jest |jest plugin|
|testus-plugin-karma |karma plugin|
|testus-plugin-jasmine |jasmine plugin|

## Document

TODO

## License

[MIT](http://opensource.org/license/MIT)

Copyright (c) Vee
