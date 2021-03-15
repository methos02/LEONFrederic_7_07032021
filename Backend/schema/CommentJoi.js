/**
 * Schéma de validation Joi pour les Commentaires
 */
const joi = require('joi');
const base = {
    UserId: joi.number().required(),
    content: joi.string().min(3).required(),
};

module.exports =  {
    create: joi.object({ ...base,
        PostId: joi.number().required(),
    }),
    update: joi.object(base)
};
