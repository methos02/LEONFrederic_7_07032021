const fs = require('fs');
const path = require('path');

before(() => {
    resetDir('./images/post');
    resetDir('./images/avatar');
})

describe('Tests', () => {
    require('./controllers/authControllerTest');
    require('./controllers/postControllerTest');
    require('./controllers/commentControllerTest');
    require('./controllers/adminControllerTest');
    require('./controllers/userControllerTest');
})

function resetDir(dir) {
    const keepFiles = ['.gitignore', 'post_3.webp', 'default_avatar.jpg'];

    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            if(keepFiles.indexOf(file) === -1 ) {
                fs.unlink(path.join(dir, file), err => { if (err) throw err; });
            }
        }
    });
}
