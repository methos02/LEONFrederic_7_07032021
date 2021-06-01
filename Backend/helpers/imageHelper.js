const fs = require('fs');
const path = require('path')

/**
* Fonction Helper pour les image
 */
module.exports = {
    /**
     * Déplace les images upload du dossier temp dans le dossier ciblé
     * @param img
     * @param folder
     */
    moveFromTemp: (img, folder = '') => {
        fs.rename(fs.realpathSync(img), fs.realpathSync(img).replace('\\temp', defineFolder(folder)), (err) => { if (err) throw err; });
    },

    /**
     * Suppression d'une image
     * @param img
     */
    deleteImg: (img) => {
        fs.unlink(path.resolve(__dirname, './../' + img), (err) => { if (err) throw err; })
    },
    avatarPath: '/images/avatar/',
    postPath: '/images/post/',
    defaultAvatar: 'default_avatar.png'
}

/**
 * Ajoute un slash devant le nom du dossier pour le remplacer dans le nom de l'image
 * @param folder
 */
function defineFolder(folder) {
    return folder !== '' ? '\\' + folder : '';
}
