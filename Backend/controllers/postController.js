const {Post, Like} = require('../config/database');
const userJoin = require('../helpers/join/userJoin');
const commentJoin = require('../helpers/join/commentJoin');
const { deleteImg } = require('../helpers/imageHelper');
const { formatResponse, getPage, constante } = require('../helpers/paginateHelper');
const postType = require('../helpers/postType');
const {postPath} = require("../helpers/imageHelper");

/**
 * Retourne tous les posts du site en fonction de la pagination
 */
exports.index = async (req, res) => {
    const page = getPage(req.query);
    const type = Object.keys(postType).filter(function(key) { return postType[key]['slug'] === req.params.type; });
    const where = type.length !== 0 ? {type: postType[type]['id']} : {};

    const posts = await Post.findAndCountAll({
        where: where,
        limit: constante.PAGINATE_LIMITE,
        offset: constante.PAGINATE_LIMITE * page,
        include: [userJoin, commentJoin],
        distinct: true,
        order: [['id', 'DESC']]
    }).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la récupération des posts."}) });

    if(posts === undefined) { return;}
    return res.status(200).json(formatResponse(posts, page));
};

/**
 * Retourne un post précise en fonction du slug présent dans la requète
 */
exports.show = (req, res) => {
    Post.findOne({where : { slug : req.params.slug }, include: [userJoin, commentJoin]})
        .then(post => {
            if(post === null) return res.status(404).json({ error : 'Article introuvable.'});
            res.status(200).json(post)
        })
        .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la récupération du post."}) });
};

/**
 * Enregistre un post en bdd
 */
exports.store = async (req, res) => {
    Post.create( {...req.store.valideData, UserId: req.store.userLog.id }, { fields : defineCreateFields(req.store.valideData.type)} )
        .then( res.status(201).json({ message: 'Post enregistré !'}))
        .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la crétion du post."}) });
};

/**
 * Met à jour un post en bdd
 */
exports.update = (req, res) => {
    if (req.file) {
        if(req.store.Post.image !== null) { deleteImg(postPath + req.store.Post.image)}
    }

    Post.update( req.store.valideData, { where: { id: req.params.id }, fields: defineUpdateFields(req.store.Post.type)})
        .then(() => res.status(200).json({ message: 'Post modifié !'}))
        .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la modification du post."}) });
}

/**
 * Supprime un post en fonction de l'id présent dans la requête
 */
exports.delete = (req, res) => {
    if(req.store.Post.image !== null && req.store.Post.image !== 'post_3.webp') { deleteImg(postPath + req.store.Post.image)}

    Post.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Post supprimé !'}))
        .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la suppression du post."}) });
}

/**
 * Like ou Dislike un post en fonction de l'id dans la requête
 */
exports.like = async (req, res) => {
    const post = await Post.findByPk(req.params.id).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la récupération du post."}) });
    if(post === undefined) { return;}
    if(post === null) { return res.status(404).json({ error: 'Post introuvable' }); }

    const like = await Like.findOne({ where: { UserId : req.store.userLog.id, PostId: req.params.id}}).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la vérification de votre appréciation."}) });
    if(like === undefined) { return;}

    const likes = calculLikeDislike(post, like, req.store.valideData.like);

    if(like === null) {
        await Post.update(likes, { where: { id: req.params.id }});
        Like.create({UserId: req.store.userLog.id, PostId: req.params.id, like: req.store.valideData.like })
            .then(() => res.status(201).json({ message: 'Like enregistré !', likes}))
            .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de votre like."}) });
    }

    await Post.update(likes, { where: { id: req.params.id }}).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la mise a jour des likes du post."}) });
    await Like.update({ like: like.like === parseInt(req.store.valideData.like) ? 0 : req.store.valideData.like }, { where: { UserId: req.store.userLog.id, PostId: req.params.id }}).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la mise a jour de votre like."}) });
    return res.status(200).json({ message: 'Like update !', likes, cancel :  like.like === req.store.valideData.like });
}

/**
 * défini les likes et dislikes d'un post en fonction du nouveau vote
 */
function calculLikeDislike(post, like, vote) {
    if(like !== null && like.like === 1) { post.likes--; }
    if(like !== null && like.like === -1) { post.dislikes--; }

    if(vote === 1  && (like === null || like.like !== parseInt(vote))) { post.likes++; }
    if(vote === -1 && (like === null || like.like !== parseInt(vote))) { post.dislikes++; }

    return { likes: post.likes, dislikes: post.dislikes }
}

/**
 * Helper pour définir les champs lors de la création d'un post en fonction de son type
 */
function defineCreateFields(type) {
    const fields = ['UserId', 'type', 'image', 'content'];
    return parseInt(type) === postType.ARTICLE.id ? [...fields, 'title', 'slug'] : fields;
}

/**
 * Helper pour définir les champs lors de la mise a jour d'un post en fonction de son type
 */
function defineUpdateFields(type) {
    return parseInt(type) === postType.ARTICLE.id ? ['image', 'title', 'content'] : ['content'];
}
