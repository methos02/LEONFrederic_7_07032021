/**
 * Middleware d'authentification.
 */
const jwt = require('jsonwebtoken');
const {User} = require('../config/database');
const { deleteImg } = require('../helpers/imageHelper');

module.exports = async (req, res, next) => {
    if(req.headers.authorization === undefined) {
        return res.status(401).json({ error: 'Authorization invalide.' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.APP_KEY, (err, decoded) => { return err !== null ? err : decoded; });
    if(decodedToken.userId === undefined) {
        if(req.file) { deleteImg(req.file.path)}
        return res.status(401).send({ error: 'Token invalide.' });
    }

    const user = await User.findByPk(decodedToken.userId).catch(error => { console.log(error); res.status(500).json({error : "Une erreur est survenue lors de la récupération de vos données." })});
    if(user === undefined) {return;}
    if(user === null) {
        if(req.file) { deleteImg(req.file.path)}
        return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    req.store.userLog = user;
    next();
};
