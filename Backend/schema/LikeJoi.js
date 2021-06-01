/**
 * Schéma de validation Joi pour les Likes
 */
const joi = require('joi');

module.exports = joi.object({
    like: joi.valid(1, 0, -1).required()
});
