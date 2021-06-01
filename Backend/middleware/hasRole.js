/**
 * Middleware pour verrifier le role de l'utilisateur.
 */
module.exports = function hasRole(name) {
    return  (req, res, next) => {

        if(!req.store.userLog.roles.find(role => role === name)) {
            return res.status(401).json({ error: 'Requête inconnue.' });
        }

        next();
    };
}
