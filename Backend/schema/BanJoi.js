/**
 * Schéma de validation Joi pour les Commentaires
 */
const joi = require('joi');

module.exports =  joi.object({
    UserId: joi.number().required(),
    message: joi.string().required()
});
