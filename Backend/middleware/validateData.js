/**
 * Middleware de validation Joi
 */

const {deleteImg} = require('../helpers/imageHelper');

/**
 * Valide ou non les datas dans la requête et enregistre les datas validées dans la requête
 * @param joiSchema
 * @param model "nom du model dans la requête"
 */
module.exports = function validate(joiSchema, model) {
    return (req, res, next) => {
        const paramValid = joiSchema.validate(defineDataFromReq(req, model));

        if(paramValid.error !== undefined) {
            if(req.file) { deleteImg(req.file.path)}
            return res.status(400).json( paramValid.error );
        }

        req.store.valideData = paramValid.value;

        next();
    }
}

/**
 * Récupère les datas de la requête en fonction de la présence ou nom d'un file
 * @param req "nom du model dans la requête"
 * @param model "nom du model dans la requête"
 * @returns datas
 */
function defineDataFromReq(req, model) {
    if(req.file) {
        return {
            ...JSON.parse(req.body[model]),
            [ req.file.fieldname ] : `/images/${model}/${req.file.filename}`
        }
    }

    return { ...req.body }
}
