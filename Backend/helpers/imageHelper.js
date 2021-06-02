const fs = require('fs');
const { access, rename } = require ('fs/promises');
const path = require('path');

/**
 * Fonction Helper pour les image
 */
module.exports = {
    /**
     * Suppression d'une image
     * @param img
     */
    deleteImg: (img) => {
        fs.access( path.resolve(__dirname, './../' + img), fs.F_OK, (err) => {
            if (!err) {
                fs.unlink(path.resolve(__dirname, './../' + img), (err) => { if (err) throw err; })
            }
        })
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
