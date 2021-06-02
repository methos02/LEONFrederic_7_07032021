const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {defaultAvatar, avatarPath} = require("../helpers/imageHelper");
const { formatDateHour } = require('../helpers/dateHelper')
const { User, Like }= require('../config/database');

/**
 * Enregistre un utilisateur en bdd
 */
exports.signup = async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10).catch(error => { console.log(error); res.status(500).json({ error : "Une erreur est survenue lors du traitement de votre mot de passe." })});
    const user = await User.create({ ...req.store.valideData, password: hash}).catch(error => { console.log(error); res.status(500).json({error : "Une erreur est survenue lors de la création de votre compte." })});

    const token = jwt.sign( { userId: user.id }, process.env.APP_KEY, { expiresIn: '24h' });
    delete user.dataValues.password;

    return res.status(201).json({ message: 'Utilisateur créé !', user : {...user.dataValues, name: user.name, token : token, avatarPath: process.env.BASE_URL + avatarPath + defaultAvatar, likes : [], roles : user.roles}})
};

/**
 * Verrifie et connecte une utilisateur
 */
exports.login = async (req, res) => {
    const user = await User.findOne({ where : { email: req.body.email }}).catch(error => res.status(500).json({ error }));

    if (!user) {
        return res.status(401).json({ error: 'Mot de passe ou Utilisateur incorrect!' });
    }

    const valid = await bcrypt.compare(req.body.password, user.password).catch(error => res.status(500).json({ error }));
    if (!valid) {
        return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect!' });
    }

    const dateBan = new Date(user.banUntil);
    const now = new Date();
    if(user.banUntil !== null && dateBan > now) {
        return res.status(401).json({ error: `Votre a été banni jusqu'au ${ formatDateHour(dateBan)}.`, message:  user.messageBan });
    }

    if(user.banUntil !== null && dateBan <= now) {
        User.update({banUntil: null, messageBan: null }, {where: { id: user.id}}).catch(error => res.status(500).json({ error }));
    }

    const token = jwt.sign( { userId: user.id }, process.env.APP_KEY, { expiresIn: '24h' });
    const userResp = await getUser(user).catch(error => res.status(500).json({ error }));
    res.status(200).json({ user: { ...userResp, token : token }});
};

/**
 * Récupération de l'utilisateur courant
 */
exports.currentUser = async (req, res) => {
    res.status(200).json(await getUser(req.store.userLog));
}

/**
 * Fonction helper pour la récupération et le formatage de l'utilisateur courant
 */
async function getUser(user) {
    const likes = await Like.findAll({ where: { userId : user.id}, attributes: ['PostId', 'like']}).catch(error =>  error );
    return { id: user.id, lastname: user.lastname, firstname: user.firstname, name : user.name, avatarPath : user.avatarPath, email: user.email, roles: user.roles, likes : likes }
}
