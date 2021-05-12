/**
 * Schéma de validation Joi pour les Post
 */
const joi = require('joi');
const {roles} = require('../helpers/rolesHelper')

module.exports = {
    profil_update : joi.object({
        lastname: joi.string().min(3).required(),
        firstname: joi.string().min(3).required(),
        email: joi.string().email().required(),
        avatar: joi.string()
    }),
    password_update: joi.object({
        old: joi.string().min(6).max(24).required(),
        password: joi.string().min(6).max(24).required(),
        confirm: joi.string().equal(joi.ref('password'))
    }),
    roles_update: joi.object({
        roles: joi.array().items(joi.string().valid('', ...roles)).required()
    })
};
