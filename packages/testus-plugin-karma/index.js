const { info } = require('../shared');

info(`karma测试库加载`)

const path = require('path');

exports.karmaTemplateFn = ( args, relativePath ) => {
    const map = {
        name: '',
        description: '',
        params: [],
        return: ''
    };

    args.forEach(arg => {
        const title = arg.title;
        switch (title) {
            case 'name':
                map[title] = arg.name;
                break;
            case 'description':
                map[title] = arg.description;
                break;
            case 'param':
                map['params'].push(arg.description);
                break;
            case 'return':
                map[title] = arg.description;
                break;
            default:
                break;
        }
    })

    return (
`const {${map.name}} = require('${relativePath}')
describe(${map.description}, function(){
    expect(${map.name}(${map.params.join(',')})).toBe(${map.return})
})
`
    )
}