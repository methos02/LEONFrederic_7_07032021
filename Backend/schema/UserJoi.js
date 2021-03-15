/**
 * Schéma de validation Joi pour les Post
 */
const joi = require('joi');

module.exports = {
    profil_update : joi.object({
        UserId: joi.number().required(),
        name: joi.string().min(3).required(),
        email: joi.string().email().required(),
        avatar: joi.string()
    }),
    password_update: joi.object({
        UserId: joi.number().required(),
        password: joi.string().min(6).max(24).required(),
        confirm: joi.string().equal(joi.ref('password'))
    })
};
