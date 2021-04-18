const {addWeek, formatDate} = require("../helpers/dateHelper");
const { formatResponse, getPage, constante } = require('../helpers/paginateHelper');
const User = require('../models').User;
const Comment = require('../models').Comment;
const sequelize = require('sequelize');

/**
 * affiche la liste de tout les utilisateurs, uniquement pour l'admin
 */
exports.users = async (req, res) => {
    const page = getPage(req.query);

    const users = await User.findAndCountAll({
        attributes : ['id', 'name', 'email', 'avatar', 'avatarPath', 'nbBan', 'banUntil', 'formatBanUntil'],
        limit: constante.PAGINATE_LIMITE,
        offset: constante.PAGINATE_LIMITE * page,
        where: { banUntil : null, isAdmin: 0 },
        order: [['id', 'DESC']]
    }).catch(error => res.status(500).json({ error }));

    return res.status(200).json(formatResponse(users, page));
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
exports.comments = async (req, res) => {
    const page = getPage(req.query);

    const comments = await Comment.findAndCountAll({
        limit: constante.PAGINATE_LIMITE,
        offset: constante.PAGINATE_LIMITE * page,
        order: [['id', 'DESC']]
    }).catch(error => res.status(500).json({ error }));
    console.log(formatResponse(comments, page));
    return res.status(200).json(formatResponse(comments, page));
};
