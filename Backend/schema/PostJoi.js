/**
 * Schéma de validation Joi pour les Post
 */
const joi = require('joi');
const postType = require('../helpers/postType')

module.exports =  joi.object({
    UserId: joi.number().required(),
    title: joi.when('type', {is : postType.ARTICLE.id, then: joi.string().min(3).required()}),
    content: joi.when('type', {is : postType.ARTICLE.id, then: joi.string().min(3).required()}),
    image: joi.when('type', {is : postType.IMAGE.id, then: joi.string().min(3).required()}),
    type: joi.allow(...Object.values(postType)),
});
