const Post = require('../models').Post;
const userJoin = require('../helpers/join/userJoin');
const commentJoin = require('../helpers/join/commentJoin');
const Like = require('../models').Like;
const { moveFromTemp, deleteImg } = require('../helpers/imageHelper');
const postType = require('../helpers/postType');
const {postPath} = require("../helpers/imageHelper");

/**
 * Retourne toutes les posts du site
 */
exports.index = async (req, res) => {
    Post.findAll({ include: [userJoin, commentJoin], order: [['id', 'DESC']]})
        .then(posts => res.status(200).json(posts))
        .catch(error => {
            return res.status(400).json({error})
        });
};

/**
 * Retourne un post précise en fonction de l'id présent dans la requète
 */
exports.type = (req, res) => {
    const type = Object.keys(postType).filter(function(key) { return postType[key]['slug'] === req.params.type; })
    if(type.length === 0) { return res.status(404).json({ error: 'Type introuvable' }); }

    Post.findAll( { where: {type: postType[type]['id']}, include: [userJoin, commentJoin]})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

/**
 * Retourne un post précise en fonction de l'id présent dans la requète
 */
exports.show = (req, res) => {
    Post.findByPk( req.params.id , { include: [userJoin, commentJoin]})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

/**
 * Enregistre un post en bdd
 */
exports.store = (req, res) => {
    if (req.file) { moveFromTemp(req.file.path, 'post') }

    Post.create( {...req.store.valideData, UserId: req.store.userLog.id }, { fields : defineCreateFields(req.store.valideData.type)} )
        .then((post) => res.status(201).json({ message: 'Post enregistré !', post}))
        .catch(error => res.status(400).json({ message : 'Erreur de post :' + error }));
};

/**
 * Met à jour un post en bdd
 */
exports.update = (req, res) => {
    if (req.file) {
        if(req.store.Post.image !== null) { deleteImg(postPath + req.store.Post.image)}
        moveFromTemp(req.file.path, 'post')
    }

    Post.update( req.store.valideData, { where: { id: req.params.id }, fields: defineUpdateFields(req.store.Post.type)})
        .then(() => res.status(200).json({ message: 'Post modifié !'}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Supprime un post en fonction de l'id présent dans la requête
 */
exports.delete = (req, res) => {
    if(req.store.Post.image !== null) { deleteImg(postPath + req.store.Post.image)}

    Post.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Post supprimé !'}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Like ou Dislike un post en fonction de l'id dans la requête
 */
exports.like = async (req, res) => {
    const post = await Post.findByPk(req.params.id).catch(error => res.status(500).json({ error }));
    if(post === null) { return res.status(404).json({ error: 'Post introuvable' }); }

    const like = await Like.findOne({ where: { UserId : req.store.userLog.id, PostId: req.params.id}}).catch(error => res.status(500).json({ error }));
    const likes = calculLikeDislike(post, like, req.store.valideData.like);

    if(like === null) {
        await Post.update(likes, { where: { id: req.params.id }});
        Like.create({UserId: req.store.userLog.id, PostId: req.params.id, like: req.store.valideData.like })
            .then(() => res.status(201).json({ message: 'Like enregistré !', likes}))
            .catch(error => res.status(400).json({ error }));
    }

    if (like.like === req.store.valideData.like) { return res.status(401).json({ error: 'Vous avez déjà voté!' }); }

    await Post.update(likes, { where: { id: req.params.id }});
    await Like.update({ like: req.store.valideData.like }, { where: { UserId: req.store.userLog.id, PostId: req.params.id }});
    return res.status(200).json({ message: 'Like update !', likes });
}

function calculLikeDislike(post, like, vote) {
    if(like !== null && like.like === 1) { post.like--; }
    if(like !== null && like.like === -1) { post.dislike--; }

    if(vote === 1) { post.like++; }
    if(vote === -1) { post.dislike++; }

    return { like: post.like, dislike: post.dislike }
}

function defineCreateFields(type) {
    const fields = ['UserId', 'type', 'image', 'content'];
    return parseInt(type) === postType.ARTICLE.id ? [...fields, 'title'] : fields;
}

function defineUpdateFields(type) {
    const fields = ['image'];
    return parseInt(type) === postType.ARTICLE.id ? [...fields, 'title', 'content'] : fields;
}
