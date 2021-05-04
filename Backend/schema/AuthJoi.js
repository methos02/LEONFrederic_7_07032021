/**
 * Schéma de validation Joi pour l'authentification
 */
const joi = require('joi');

module.exports = {
    signup : joi.object({
        lastname: joi.string().required(),
        firstname: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(24).required(),
        confirm: joi.string().equal(joi.ref('password'))
    }),

    login : joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(24).required(),
    })
};
