const {addWeek, formatDate} = require("../helpers/dateHelper");
const { formatResponse, getPage, constante } = require('../helpers/paginateHelper');
const User = require('../models').User;
const Comment = require('../models').Comment;
const sequelize = require('sequelize');
const userJoin = require('../helpers/join/userJoin');
const {Op} = require("sequelize");
const { orderSearch } = require('../helpers/searchHelper')

/**
 * affiche la liste de tout les utilisateurs, uniquement pour l'admin
 */
exports.users = async (req, res) => {
    const page = getPage(req.query);

    const users = await User.findAndCountAll({
        attributes : ['id', 'firstname', 'lastname', 'name', 'email', 'avatar', 'avatarPath', 'nbBan', 'banUntil', 'formatBanUntil'],
        limit: constante.PAGINATE_LIMITE,
        offset: constante.PAGINATE_LIMITE * page,
        where: { banUntil : null, roles: null },
        order: [['id', 'DESC']]
    }).catch(error => res.status(500).json({ error }));

    return res.status(200).json(formatResponse(users, page));
};

exports.search = async (req, res) => {
    const users = await Promise.all([
        User.findAll({ where : { firstname: { [Op.like]: `${req.params.slug}%`}, banUntil : null, roles: null  }, limit: 5 }),
        User.findAll({ where : { lastname: { [Op.like]: `${req.params.slug}%`}, banUntil : null, roles: null  }, limit: 5 }),
    ]);

    return res.status(200).json({ users : orderSearch(users) });
}

/**
 * Bannissement d'un utilisateur pour 7 jours, action reservé à l'admin
 */
exports.ban = (req, res) => {
    const date_ban = addWeek(new Date());

    User.update({ banUntil: date_ban, nbBan: sequelize.literal('nbBan + 1'), messageBan :  req.store.valideData.message}, { where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: "Le profile est banni jusqu'au " + formatDate(date_ban) + ".", banUntil : date_ban , formatBanUntil : formatDate(date_ban) }))
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
        include: [userJoin],
        order: [['id', 'DESC']]
    }).catch(error => res.status(500).json({ error }));

    return res.status(200).json(formatResponse(comments, page));
};
