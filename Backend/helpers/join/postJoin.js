const {Comment, User, Post} = require('../../config/database');
const commentJoin = require('./commentJoin');
const userJoin = require('./userJoin');

/**
 * Include des posts pour les requêtes Sequelize
 */
module.exports = {
    model: Post,
    include: [{...commentJoin, model : Comment }, {...userJoin, model : User}],
}
