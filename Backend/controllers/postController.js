// const imageH = require('../helpers/imageHelper');
// const fs = require('fs');
const Post = require('../models').Post;
const User = require('../models').User;
const Like = require('../models').Like;
const Comment = require('../models').Comment;

/**
 * Retourne toutes les posts du site
 */
exports.index = async (req, res) => {
    const userJoin = {
        model: User,
        attributes: ['id', 'name', 'avatar'],
    }

    Post.findAll({ include: [userJoin, Comment]})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

/**
 * Retourne un post précise en fonction de l'id présent dans la requète
 */
exports.show = (req, res) => {
    Post.findByPk( req.params.id , { include: [User, Comment]})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

/**
 * Enregistre un post en bdd
 */
exports.store = (req, res) => {
    Post.create( { ...req.store.valideData, UserId: req.body.UserId } )
        .then((post) => res.status(201).json({ message: 'Post enregistré !', post : post}))
        .catch(error => res.status(400).json({ message : 'Erreur de post :' + error }));
};

/**
 * Met à jour un post en bdd
 */
exports.update = (req, res) => {
    Post.update({ ...req.store.valideData, id: req.params.id }, { where: { id: req.params.id }, fields: ['title', 'content']})
        .then(() => res.status(200).json({ message: 'Post modifié !'}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Supprime un post en fonction de l'id présent dans la requête
 */
exports.delete = (req, res) => {
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

    const like = await Like.findOne({ where: { UserId : req.body.UserId, PostId: req.params.id}}).catch(error => res.status(500).json({ error }));
    if(like === null) {
        await Post.update(calculLikeDislike(post, like, req.body.like), { where: { id: req.params.id }});
        Like.create({UserId: req.body.UserId, PostId: req.params.id, like: req.body.like })
            .then(() => res.status(201).json({ message: 'Like enregistré !'}))
            .catch(error => res.status(400).json({ error }));
    }

    if (like.like === req.body.like) { return res.status(401).json({ error: 'Vous avez déjà voté!' }); }

    await Post.update(calculLikeDislike(post, like, req.body.like), { where: { id: req.params.id }});
    await Like.update({ like: req.body.like }, { where: { UserId: req.body.UserId, PostId: req.params.id }});
    return res.status(200).json({ message: 'Like update !' });
}

function calculLikeDislike(post, like, vote) {
    if(like !== null && like.like === 1) { post.like--; }
    if(like !== null && like.like === -1) { post.dislike--; }

    if(vote === 1) { post.like++; }
    if(vote === -1) { post.dislike++; }

    return { like: post.like, dislike: post.dislike }
}
