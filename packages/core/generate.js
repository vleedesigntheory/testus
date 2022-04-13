const { error, done } = require('../shared')

module.exports = (args) => {
    console.log('generate', args);
    // 生成文件
    done('自动生成测试文件完成')
}