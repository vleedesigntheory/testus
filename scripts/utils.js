const fs = require('fs');
const path = require('path');

exports.modifyEnv = (content, log) => {
    fs.promises.readdir(path.resolve(__dirname, '../packages')).then(files => {
        console.log('files', files);
        files.forEach(file => {
            fs.promises.writeFile(path.resolve(__dirname, `../packages/${file}/env.json`), content)
                .then(() => console.log(`${file}${log}`))
                .catch(e => console.error(e));
        })
    }).catch(e => console.error(e));
}
