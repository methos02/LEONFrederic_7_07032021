const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const Like = require('../models').Like;

/**
 * Enregistre un utilisateur en bdd
 */
exports.signup = async (req, res) => {
    const user = await User.findOne({ where:{ email: req.store.valideData.email } }).catch(error => res.status(500).json({ error }));
    if(user !== null) { return res.status(400).json({ error: 'Email déjà utilisé.' }); }

    const hash = await bcrypt.hash(req.body.password, 10).catch(error => res.status(500).json({ error }));

    User.create({ ...req.store.valideData, password: hash})
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }))
    ;
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

    const token = jwt.sign( { userId: user.id }, process.env.APP_KEY, { expiresIn: '24h' });

    res.status(200).json({ user: {...await getUser(user), token : token}});
};

exports.currentUser = async (req, res) => {
    res.status(200).json(await getUser(req.store.userLog));
}

async function getUser(user) {
    const likes = await Like.findAll({ where: { userId : user.id}, attributes: ['PostId', 'like']})
    return { id: user.id, name : user.name, avatarPath : user.avatarPath, email: user.email, isAdmin: user.isAdmin, likes : likes }
}
