const fs = require('fs');
const path = require('path');

before(() => {
    resetDir('./images/temp');
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
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            if(file.indexOf('gitignore') === -1) {
                fs.unlink(path.join(dir, file), err => { if (err) throw err; });
            }
        }
    });
}
