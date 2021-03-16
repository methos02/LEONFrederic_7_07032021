/**
 * Middleware qui déplace les files de la requête dans le dossier temp .
 */
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images/temp');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name.replace(/\..+$/, '') + '-' + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage});
