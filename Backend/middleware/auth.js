/**
 * Middleware d'authentification.
 */

const jwt = require('jsonwebtoken');
const User = require('../models').User;

module.exports = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.APP_KEY);
    const UserId = decodedToken.userId;

    if (req.body.UserId === undefined || req.body.UserId !== UserId) { return res.status(401).json({ error: 'Requête invalide.' });}

    const user = await User.findByPk(UserId).catch(error => res.status(500).json({ error }));
    if(user === null) { return res.status(404).json({ error: 'Utilisateur introuvable.' }); }

    req.store.userLog = user;
    next();
};
