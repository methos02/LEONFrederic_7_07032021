/**
 * Middleware de validation Joi
 */

const {deleteImg} = require('../helpers/imageHelper');
const User = require('../models').User;

/**
 * Valide ou non les datas dans la requête et enregistre les datas validées dans la requête
 * @param joiSchema
 * @param model "nom du model dans la requête"
 */
module.exports = function validate(joiSchema, model) {
    return async (req, res, next) => {
        const paramValid = joiSchema.validate(defineDataFromReq(req, model));

        if(paramValid.error !== undefined) {
            if(req.file) { deleteImg(req.file.path)}
            return res.status(400).json( getError(paramValid) );
        }

        if (req.route.path === '/signup') {
            const user = await User.findOne({ where:{ email: paramValid.value.email } }).catch(error => { console.log(error);  res.status(500).json({error : "Une erreur est survenue lors de la verification de votre email."})});
            if(user !== null) { return res.status(400).json({ email: errors.email['email.uniq'] }); }
        }

        req.store.valideData = paramValid.value;

        next();
    }
}

/**
 * Récupère les datas de la requête en fonction de la présence ou nom d'un file
 * @param req "nom du model dans la requête"
 * @param model "nom du model dans la requête"
 */
function defineDataFromReq(req, model) {
    if(req.file) {
        return {
            ...(typeof req.body[model] === 'object' ? req.body[model] : JSON.parse(req.body[model])),
            [ req.file.fieldname ] : req.file.filename
        }
    }

    if(req.body[model] !== undefined) {return { ...req.body[model] }}

    return { ...req.body }
}

function getError(data) {
    console.log(data.error.details[0].path[0] + ' - ' + data.error.details[0].type + ' : ' + data.error.details[0].message);

    return { [data.error.details[0].path[0]]: errors[data.error.details[0].path[0]][data.error.details[0].type] }
}

const errors = {
    email: {
        'string.empty' : "L'adresse email est requise.",
        'any.required' : "L'adresse email est requise.",
        'string.email' : "L'email est invalide.",
        'email.uniq' : "Cet email est déjà utilisé."
    },
    password : {
        'any.required' : "Le mot de passe est requit.",
        'string.min' : "Le mot de passe doit faire minimum 6 caractères."
    },
    confirm : {
        'any.required' : "La confirmation du mot de passe est requise.",
        'any.only' : "Le mot de passe et la confirmation doivent être identique."
    },
    lastname : {
        'any.required' : "Le nom est requit.",
        'string.empty' : "Le nom est requit.",
    },
    firstname : {
        'any.required' : "Le prénom est requit.",
        'string.empty' : "Le prénom est requit.",
    }
}
