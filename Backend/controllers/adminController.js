const {addWeek} = require("../helpers/dateHelper");
const { formatResponse, getPage, constante } = require('../helpers/paginateHelper');
const { User, Comment} = require('../config/database');
const sequelize = require('sequelize');
const userJoin = require('../helpers/join/userJoin');
const {Op} = require("sequelize");
const { orderSearch } = require('../helpers/searchHelper')

/**
 * affiche la liste de tout les utilisateurs pour l'admin
 */
exports.users = async (req, res) => {
    const res_users = await loadUsers(req.query);
    return res.status( res_users.error === undefined ? 200 : 500 ).json(res_users);
};

/**
 * Fonction de recherche pour l'admin
 */
exports.search = async (req, res) => {
    const users = await Promise.all([
        User.findAll({ where : { firstname: { [Op.like]: `${req.params.slug}%`}, banUntil : null, roles: null  }, limit: 5 }),
        User.findAll({ where : { lastname: { [Op.like]: `${req.params.slug}%`}, banUntil : null, roles: null  }, limit: 5 }),
    ]).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la recherche."}) });

    return res.status(200).json({ users : orderSearch(users) });
}

/**
 * Bannissement d'un utilisateur pour 7 jours, action reservé à l'admin
 */
exports.ban = async (req, res) => {
    const ban = await User.update({
        banUntil: addWeek(new Date()),
        nbBan: sequelize.literal('nbBan + 1'),
        messageBan :  req.store.valideData.message
    }, { where: { id: req.params.id } }
    );

    if ( ban ) {
        const res_users = await loadUsers({});
        return res.status( res_users.error === undefined ? 200 : 500 ).json(res_users);
    }
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

/**
 * Fonction helper pour chargé les utilisateurs pour l'admin avec la pagination
 */
const loadUsers = async (query) => {
    const page = getPage(query);

    const users = await User.findAndCountAll({
        attributes : ['id', 'firstname', 'lastname', 'name', 'email', 'avatar', 'avatarPath', 'nbBan', 'banUntil', 'formatBanUntil'],
        limit: constante.PAGINATE_LIMITE,
        offset: constante.PAGINATE_LIMITE * page,
        where: { banUntil : null, roles: null },
        order: [['id', 'DESC']]
    }).catch(error => {
        console.log(error);
        return { error: 'Une erreur est survenue lors de la récupération des utilisateurs' }
    });

    return formatResponse(users, page);
}
