const { modifyEnv } = require('./utils');

exports.prod = () => {
    const content = 
`{
    "isDev": false
}`
    modifyEnv(content, '修改为生产环境')
}
