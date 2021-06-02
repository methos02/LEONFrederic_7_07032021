const {User} = require('../../config/database');

/**
 * Include des users pour les requêtes Sequelize
 */
module.exports = {
    model: User,
    attributes: ['id', 'firstname', 'lastname', 'name', 'slug', 'avatar', 'avatarPath'],
}
