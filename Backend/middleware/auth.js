/**
 * Middleware d'authentification.
 */

const jwt = require('jsonwebtoken');
const User = require('../models').User;
const { deleteImg } = require('../helpers/imageHelper');

module.exports = async (req, res, next) => {
    if(req.headers.authorization === undefined) {
        return res.status(401).json({ error: 'Authorization invalide.' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.APP_KEY, (err, decoded) => {
        if(err) res.status(500).json({ err })
        return decoded;
    });

    const UserId = decodedToken.userId;
    const reqUserId = req.store.valideData !== undefined ? req.store.valideData.UserId : req.body.UserId;

    if (reqUserId === undefined || reqUserId !== UserId) {
        if(req.file) { deleteImg(req.file.path)}
        return res.status(401).json({ error: 'Requête invalide.' });
    }

    const user = await User.findByPk(UserId, {attributes: { exclude: ['password']}}).catch(error => res.status(500).json({ error }));
    if(user === null) {
        if(req.file) { deleteImg(req.file.path)}
        return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    req.store.userLog = user;
    next();
};
