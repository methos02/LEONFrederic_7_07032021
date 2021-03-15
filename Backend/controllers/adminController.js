const User = require('../models').User;
const Comment = require('../models').Comment;
const bcrypt = require('bcrypt');

/**
 * affiche la liste de tout les utilisateurs, uniquement pour l'admin
 */
exports.users = (req, res) => {
    User.findAll()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
};

/**
 * Bannissement d'un utilisateur pour 7 jours, action reservé à l'admin
 */
exports.ban = (req, res) => {
    const date_ban = new Date()

    User.update({ banUntil: date_ban.getDate() }, { where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: "Le profil est banni jusqu'au " + date_ban.getDate() + "."}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * affiche la liste de tout les commentaires, uniquement pour l'admin
 */
exports.comments = (req, res) => {
    Comment.findAll()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
};
