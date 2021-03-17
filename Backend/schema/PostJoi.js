/**
 * Schéma de validation Joi pour les Post
 */
const joi = require('joi');
const postType = require('../helpers/postType')

const base = {
    UserId: joi.number().required(),
    title: joi.string().when('type', {is: postType.ARTICLE.id, then: joi.required()}),
    content: joi.string().when('type', {is: postType.ARTICLE.id, then: joi.required()}),
    image: joi.string().when('type', {is: postType.IMAGE.id, then: joi.required()}),

}

module.exports = {
    create: joi.object({
        ...base,
        type: joi.valid(...Object.values(postType).map((type) => type.id)).required(),
    }),
    update: joi.object(base)
};
