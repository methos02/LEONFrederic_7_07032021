const User = require('../models').User;
const bcrypt = require('bcrypt');
const { moveFromTemp, deleteImg } = require('../helpers/imageHelper');

exports.show = (req, res) => {
    return res.status(200).json(req.store.userLog);
}

/**
 * Met à jour le profil d'utilisateur action reservé à l'utilisateur
 */
exports.update = async (req, res) => {
    if(req.store.userLog.id !== parseInt(req.params.id)) {
        return res.status(404).json({error: 'Utilisateur incompatible.'});
    }

    const user = await User.findOne({where: {email: req.store.valideData.email}}).catch(error => res.status(500).json({ error }));
    if(user !== null && user.id !== req.store.userLog.id) {
        return res.status(422).json({error: 'Adresse email déjà utilisée.'});
    }

    if (req.file) {
        if(req.store.userLog.avatar !== null) { deleteImg(req.store.userLog.avatar)}
        moveFromTemp(req.file.path, 'avatar')
    }

    User.update({ ...req.store.valideData }, { where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Profil modifié.'}))
        .catch(error => res.status(400).json({ error }));
}

/**
 * Met à jour le profil d'utilisateur action reservé à l'utilisateur
 */
exports.password = async (req, res) => {
    if(req.store.userLog.id !== parseInt(req.params.id)) {
        return res.status(404).json({error: 'Utilisateur introuvable.'});
    }

    const hash = await bcrypt.hash(req.body.password, 10).catch(error => res.status(500).json({ error }));
    User.update({ password: hash }, { where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Mot de passe modifié.'}))
        .catch(error => res.status(500).json({ error }));
}

/**
 * Suppression d'un profil utilisateur action reservé a l'utilisateur
 */
exports.delete = (req, res) => {
    if(req.store.userLog.id !== parseInt(req.params.id)) {
        return res.status(404).json({error: 'Utilisateur introuvable.'})
    }

    if(req.store.userLog.avatar !== null) { deleteImg(req.store.userLog.avatar)}

    User.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: 'Votre profil a été supprimé.'}))
        .catch(error => res.status(400).json({ error }));
}
