const Comment = require('../../models').Comment;
const User = require('../../models').User;
const Post = require('../../models').Post;
const commentJoin = require('./commentJoin');
const userJoin = require('./userJoin');

/**
 * Include des posts pour les requêtes Sequelize
 */
module.exports = {
    model: Post,
    include: [{...commentJoin, model : Comment }, {...userJoin, model : User}],
}
