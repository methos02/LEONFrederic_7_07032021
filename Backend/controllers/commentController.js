const {Comment, Post, User} = require('../config/database');
const userJoin = require('../helpers/join/userJoin');

/**
 * Enregistre un commentaire en bdd
 */
exports.store = async (req, res) => {
    const post = await Post.findByPk( req.store.valideData.PostId ).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la récupération du post."}) });
    if(post === undefined) {return;}
    if(post === null) { return res.status(404).json({ error: 'Post introuvable!' }); }

    Comment.create( req.store.valideData )
        .then(async (comment) => {
            const user = await User.findByPk(comment.UserId).catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la récupération de vos données."}) });
            if(user === undefined) {return;}
            comment.dataValues.User = {id: user.id, name: user.name, avatar: user.avatar, avatarPath: user.avatarPath};
            res.status(201).json({ message: 'Commentaire posté.', comment: comment});
        })
        .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la création du commentaire."}) });
};

/**
 * Met à jour un commentaire en bdd
 */
exports.update = (req, res) => {
    Comment.update({ ...req.store.valideData }, { where: { id: req.params.id }, fields: ['content']})
        .then(() => res.status(200).json({ message: 'Commentaire modifié.'}))
        .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la mise à jour du commentaire."}) });
}

/**
 * Supprime un commentaire en fonction de l'id présent dans la requête
 */
exports.delete = (req, res) => {
    Comment.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Commentaire supprimé.'}))
        .catch(error => { console.log(error); return res.status(500).json({error : "Une erreur est survenue lors de la suppression du commentaire."}) });
}
