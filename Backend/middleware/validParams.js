/**
 * Valide ou non les datas dans la requête et enregistre les datas validées dans la requête
 * @param type string
 */
module.exports = function validParams(type) {
    return (req, res, next) => {
        const test = new RegExp(regex[type]);

        if(test.exec(req.params[type]) === null) {
            return res.status(404).json({error: 'Paramètre invalide.'});
        }

        next();
    }
}

const regex = {
    slug: /^[\w-]+$/,
    id: /^\d+$/,
}
