const User = require('../models').User;

module.exports = async (req, res, next) => {
    if(req.store.userLog.isAdmin === 0) {
        return res.status(401).json({ error: 'Requête inconnue.' });
    }

    next();
};
