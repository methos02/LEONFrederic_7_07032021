const {addWeek, formatDate} = require("../helpers/dateHelper");
const User = require('../models').User;
const Comment = require('../models').Comment;
const sequelize = require('sequelize');

/**
 * affiche la liste de tout les utilisateurs, uniquement pour l'admin
 */
exports.users = (req, res) => {
    User.findAll({ attributes : ['id', 'name', 'email', 'avatar', 'avatarPath', 'nbBan', 'banUntil', 'formatBanUntil']})
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
};

/**
 * Bannissement d'un utilisateur pour 7 jours, action reservé à l'admin
 */
exports.ban = (req, res) => {
    const date_ban = addWeek(new Date());

    User.update({ banUntil: date_ban, nbBan: sequelize.literal('nbBan + 1'), messageBan :  req.store.valideData.message}, { where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: "Le profil est banni jusqu'au " + formatDate(date_ban) + ".", banUntil : date_ban , formatBanUntil : formatDate(date_ban) }))
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
