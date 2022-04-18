console.log('jest plugin')

const path = require('path');

exports.jestTemplateFn = ( args, relativePath ) => {
    // console.log('args', args);

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
test(${map.description}, () => {
    expect(${map.name}(${map.params.join(',')})).toBe(${map.return})
})
`
    )
}