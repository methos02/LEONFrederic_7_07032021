/**
 * Schéma de validation Joi pour les Posts
 */
const joi = require('joi');
const postType = require('../helpers/postType')

const base = {
    title: joi.string().when('type', {is: postType.ARTICLE.id.toString(), then: joi.required()}),
    content: joi.string().when('type', {is: postType.ARTICLE.id.toString(), then: joi.required(), otherwise: joi.allow(null, '')}),
    type: joi.valid(...Object.values(postType).map((type) => type.id.toString())).required(),
}

module.exports = {
    create: joi.object({
        ...base,
        image: joi.string().when('type', {is: postType.IMAGE.id.toString(), then: joi.required()}),
    }),
    update: joi.object({ ...base, image: joi.string()})
};
