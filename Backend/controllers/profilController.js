const User = require('../models').User;
const Post = require('../models').Post;
const Like = require('../models').Like;
const userJoin = require('../helpers/join/userJoin');
const commentJoin = require('../helpers/join/commentJoin');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');
const { orderSearch } = require('../helpers/searchHelper')
const { formatResponse, getPage, constante } = require('../helpers/paginateHelper');
const {Op} = require("sequelize");
const { moveFromTemp, deleteImg, avatarPath, defaultAvatar } = require('../helpers/imageHelper');

exports.show = async (req, res) => {
    const page = getPage(req.query);
    const user = await User.findOne({ where: {slug: req.params.slug} }).catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la recherche.'}) });

    if(user === null) { return res.status(404).json({ error: 'Aucun utilisateur trouvé.'}) }

    const posts = await Post.findAndCountAll({
        where: {UserId : user.id},
        limit: constante.PAGINATE_LIMITE,
        offset: constante.PAGINATE_LIMITE * page,
        include: [userJoin, commentJoin],
        distinct: true,
        order: [['id', 'DESC']]
    }).catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la recherche.'}) });

    return res.status(200).json({...formatResponse(posts, page), user});
}

exports.search = async (req, res) => {
    const users = await Promise.all([
        User.findAll({ where : { firstname: { [Op.like]: `${req.params.slug}%`} }, limit: 5 }),
        User.findAll({ where : { lastname: { [Op.like]: `${req.params.slug}%`} }, limit: 5 }),
    ]).catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la recherche.'}) });

    return res.status(200).json({ users : orderSearch(users) });
}

/**
 * Met à jour le profile d'utilisateur action reservé à l'utilisateur
 */
exports.update = async (req, res) => {
    const user = await User.findOne({where: {email: req.store.valideData.email}}).catch(error => res.status(500).json({ error }));
    if(user !== null && user.id !== req.store.userLog.id) {
        return res.status(422).json({error: 'Adresse email déjà utilisée.'});
    }

    if (req.file) {
        if(req.store.userLog.avatar !== defaultAvatar) { deleteImg(avatarPath + req.store.userLog.avatar)}
        moveFromTemp(req.file.path, 'avatar')
        req.store.valideData.avatarPath = process.env.BASE_URL + avatarPath + req.store.valideData.avatar;
    }

    User.update({ ...req.store.valideData }, { where: { id: req.store.userLog.id }})
        .then(() => res.status(200).json({ message: 'Profil modifié.', data : { ...req.store.valideData, name: req.store.valideData.lastname + ' ' + req.store.valideData.firstname } }))
        .catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la mise à jour.'}) });
}

/**
 * Met à jour le role de l'utilisateur
 */
exports.roles = async (req, res) => {
    User.update({ roles: req.store.valideData.roles }, { where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Droits modifiés.'}))
        .catch(error => { console.log(error); return res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour des rôles.'}) });
}

/**
 * Met à jour le profil d'utilisateur action reservé à l'utilisateur
 */
exports.password = async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10).catch(error => res.status(500).json({ error }));
    User.update({ password: hash }, { where: { id: req.store.userLog.id }})
        .then(() => res.status(200).json({ message: 'Mot de passe modifié.'}))
        .catch(error => res.status(500).json({ error }));
}

/**
 * Suppression d'un profil utilisateur action reservé a l'utilisateur
 */
exports.delete = async (req, res) => {
    if(req.store.userLog.avatar !== defaultAvatar) { deleteImg(req.store.userLog.avatar)}
    const likes = await Like.findAll({where: {UserId : req.store.userLog.id }}).catch(error => res.status(400).json({ error }));
    const postToUpdate = {like : [], dislike : []};

    likes.map(( like) => { return like.like === 1 ? postToUpdate.like.push(like.PostId) : postToUpdate.dislike.push(like.PostId); });
    const t = await sequelize.transaction();

    try {
        await Post.update({ likes: sequelize.literal('likes - 1') }, {where: {id : postToUpdate.like}, transaction : t});
        await Post.update({ dislikes: sequelize.literal('dislikes - 1') }, {where: {id : postToUpdate.dislike}, transaction : t});
        await User.destroy({ where: { id: req.store.userLog.id }, transaction : t });
        await t.commit().then(() => res.status(200).json({ message: 'Votre profil a été supprimé.'}));
    } catch (error) {
        await t.rollback();
    }
}
