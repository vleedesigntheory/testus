[
    'is',
    'log',
    'utils',
    'constants',
    'reg'
].forEach(lib => {
    Object.assign(exports, require(`./${lib}`))
})