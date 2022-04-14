[
    'is',
    'log',
    'utils',
    'constants',
    'reg',
    'fn'
].forEach(lib => {
    Object.assign(exports, require(`./${lib}`))
})