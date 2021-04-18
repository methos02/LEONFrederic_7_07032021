const Comment = require('../models').Comment;
const Post = require('../models').Post;

/**
 * Enregistre un commentaire en bdd
 */
exports.store = async (req, res) => {
    const post = await Post.findByPk( req.store.valideData.PostId ).catch(error => res.status(500).json({ error }));
    if(post === null) { return res.status(404).json({ error: 'Post introuvable!' }); }

    Comment.create( req.store.valideData )
        .then((comment) => res.status(201).json({ message: 'Commentaire posté.', comment: comment}))
        .catch(error => res.status(400).json({ message : 'Erreur de commentaire :' + error }));
};

/**
 * Met à jour un commentaire en bdd
 */
exports.update = (req, res) => {
    Comment.update({ ...req.store.valideData }, { where: { id: req.params.id }, fields: ['content']})
        .then(() => res.status(200).json({ message: 'Commentaire modifié.'}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Supprime un commentaire en fonction de l'id présent dans la requête
 */
exports.delete = (req, res) => {
    Comment.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Commentaire supprimé.'}))
        .catch(error => res.status(400).json({ error }));
}
