const { modifyEnv } = require('./utils');

const dev = () => {
    const content = 
`{
    "isDev": true
}`;
    modifyEnv(content, '修改为测试环境')
}

dev()

exports.dev = dev;

