/**
 * Schéma de validation Joi pour les Post
 */
const joi = require('joi');

module.exports =  joi.object({
    UserId: joi.number().required(),
    title: joi.string().min(3).required(),
    content: joi.string().min(3).required()
});
