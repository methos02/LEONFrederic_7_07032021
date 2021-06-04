/**
 * Middleware pour verrifier le role de l'utilisateur.
 */
module.exports = function validate(model) {
    return async (req, res, next) => {
        const ressource = await model.findByPk(req.params.id).catch(error => { console.log(error); res.status(500).json({error : "Une erreur est survenue lors de la vérification de vos droits." })});

        if(ressource === undefined) { return }
        if(ressource === null || (ressource.UserId !== req.store.userLog.id && !req.store.userLog.roles.find(role => role === 'modo'))) {
            return res.status(404).json({ error: errors[model.name] });
        }

        req.store[model.name] = ressource;
        next();
    }
}

const errors = {
    Post: 'Le post est introuvable.',
    Comment: 'Le commentaire est introuvable.',
    User: "L'utilisateur est introuvable."
};
