/**
 * Schéma de validation Joi pour les Post
 */
const joi = require('joi');
const postType = require('../helpers/postType')

const base = {
    title: joi.string().when('type', {is: postType.ARTICLE.id, then: joi.required()}),
    content: joi.string().when('type', {is: postType.ARTICLE.id.toString(), then: joi.required()}),
    image: joi.string().when('type', {is: postType.IMAGE.id.toString(), then: joi.required()}),
}

module.exports = {
    create: joi.object({
        ...base,
        type: joi.valid(...Object.values(postType).map((type) => type.id.toString())).required(),
    }),
    update: joi.object(base)
};
