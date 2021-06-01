const Comment = require('../../models').Comment;
const User = require('../../models').User;
const userJoin = require('./userJoin');

/**
 * Include des commentaire pour les requêtes Sequelize
 */
module.exports = {
    model: Comment,
    include: [{...userJoin, model : User}]
}
