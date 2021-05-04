module.exports = function validate(model) {
    return async (req, res, next) => {
        const ressource = await model.findByPk(req.params.id).catch(error => res.status(500).json({ error }));

        if(ressource === null || (ressource.UserId !== req.store.userLog.id && req.store.userLog.roles.find(role => role === 'modo'))) {
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
