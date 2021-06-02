/**
 * Middleware qui déplace les files de la requête dans le dossier temp .
 */
const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folder = {image: 'post', avatar: 'avatar'};
        callback(null, path.join(__dirname, './../images/' + folder[file.fieldname]));
    },
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES.keys.indexOf(file.mimetype) === undefined) {
            callback(null, false);
            return callback(new Error("Format de l'image invalide."));
        }

        callback(null, true);
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name.replace(/\..+$/, '') + '-' + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage});
