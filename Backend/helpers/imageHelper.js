const fs = require('fs');
const path = require('path')

module.exports = {
    moveFromTemp: (img, folder = '') => {
        fs.rename(fs.realpathSync(img), fs.realpathSync(img).replace('\\temp', defineFolder(folder)), (err) => { if (err) throw err; });
    },
    deleteImg: (img) => {
        fs.unlink(path.resolve(__dirname, './../' + img), (err) => { if (err) throw err; })
    },
    avatarPath: '/images/avatar/',
    postPath: '/images/post/',
    defaultAvatar: 'default_avatar.png'
}

function defineFolder(folder) {
    return folder !== '' ? '\\' + folder : '';
}
