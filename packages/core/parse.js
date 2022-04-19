const fs = require('fs');
const path = require('path');

const { goTree } = require('./common');

function handleContent(path, item) {
    item.content = fs.readFileSync(path, 'utf-8')
    return item;
}

module.exports = (args) => {
    args.tree = goTree(args.tree, args.originName, handleContent);
    return args;
}