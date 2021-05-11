/**
 * Schéma de validation Joi pour les Commentaires
 */
const joi = require('joi');
const base = {
    content: joi.string().min(3).required(),
};

module.exports =  {
    create: joi.object({ ...base,
        UserId: joi.number().required(),
        PostId: joi.number().required(),
        ParentId: joi.number()
    }),
    update: joi.object(base)
};
