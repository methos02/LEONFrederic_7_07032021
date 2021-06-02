const {Comment, User} = require('../../config/database');
const userJoin = require('./userJoin');

/**
 * Include des commentaire pour les requêtes Sequelize
 */
module.exports = {
    model: Comment,
    include: [{...userJoin, model : User}]
}
