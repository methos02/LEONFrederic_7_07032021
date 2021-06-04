const {User, Post, Like, sequelize} = require('../config/database');
const userJoin = require('../helpers/join/userJoin');
const commentJoin = require('../helpers/join/commentJoin');
const bcrypt = require('bcrypt');
const { orderSearch } = require('../helpers/searchHelper')
const { formatResponse, getPage, constante } = require('../helpers/paginateHelper');
const {Op} = require("sequelize");
const {deleteImg, avatarPath, defaultAvatar } = require('../helpers/imageHelper');

/**
 * Affiche le profil d'un utilisateur
 */
exports.show = async (req, res) => {
    const page = getPage(req.query);
    const user = await User.findOne({ attributes : defineUserFields(), where: {slug: req.params.slug} }).catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la recherche.'}) });

    if(user === null) { return res.status(404).json({ error: 'Aucun utilisateur trouvé.'}) }

    const posts = await Post.findAndCountAll({
        where: {UserId : user.id},
        limit: constante.PAGINATE_LIMITE,
        offset: constante.PAGINATE_LIMITE * page,
        include: [userJoin, commentJoin],
        distinct: true,
        order: [['id', 'DESC']]
    }).catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la recherche.'}) });

    if(posts === undefined) {return;}
    return res.status(200).json({...formatResponse(posts, page), user});
}

/**
 * Recherche des utilisateurs dans la navbarre
 */
exports.search = async (req, res) => {
    const users = await Promise.all([
        User.findAll({ attributes : defineUserFields(),  where : { firstname: { [Op.like]: `${req.params.slug}%`} }, limit: 5 }),
        User.findAll({ attributes : defineUserFields(),  where : { lastname: { [Op.like]: `${req.params.slug}%`} }, limit: 5 }),
    ]).catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la recherche.'}) });

    if(users === undefined) {return;}
    return res.status(200).json({ users : orderSearch(users) });
}

/**
 * Met à jour le profile d'utilisateur action reservé à l'utilisateur
 */
exports.update = async (req, res) => {
    const user = await User.findOne({where: {email: req.store.valideData.email}}).catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la vérification de votre email.'});});

    if(user === undefined) {return;}
    if(user !== null && user.id !== req.store.userLog.id) {
        return res.status(422).json({error: 'Adresse email déjà utilisée.'});
    }

    if (req.file) {
        if(req.store.userLog.avatar !== defaultAvatar) { deleteImg(avatarPath + req.store.userLog.avatar)}
        req.store.valideData.avatarPath = process.env.BASE_URL + avatarPath + req.store.valideData.avatar;
    }

    User.update({ ...req.store.valideData }, { where: { id: req.store.userLog.id }})
        .then(() => res.status(200).json({ message: 'Profil modifié.', data : { ...req.store.valideData, name: req.store.valideData.lastname + ' ' + req.store.valideData.firstname } }))
        .catch(error => { console.log(error); return res.status(500).json({error : 'Une erreur est survenue lors de la mise à jour.'}) });
}

/**
 * Met à jour le role de l'utilisateur réservé a l'admin
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
        .catch(error => { console.log(error); return res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de votre mot de passe.'}) });
}

/**
 * Suppression d'un profil utilisateur action reservé a l'utilisateur
 */
exports.delete = async (req, res) => {
    if(req.store.userLog.avatar !== defaultAvatar) { deleteImg(req.store.userLog.avatar)}

    const likes = await Like.findAll({where: {UserId : req.store.userLog.id }}).catch(error => { console.log(error); return res.status(500).json({error: 'Une erreur est survenue lors de la récupération des données du post.'}) });
    if(likes === undefined) { return; }

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
        console.log(error)
        return res.status(500).json({error: 'Une erreur est survenue lors de la suppression de votre compte.'})
    }
}

/**
 * Défini les attribu utilisateur a récupérer
 */
/**
 * Helper pour définir les champs lors de la création d'un post en fonction de son type
 */
function defineUserFields() {
    return ['id', 'firstname', 'lastname', 'name', 'slug', 'avatar', 'avatarPath', 'roles']
}
