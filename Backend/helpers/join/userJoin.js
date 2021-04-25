const User = require('../../models').User;

module.exports = {
    model: User,
    attributes: ['id', 'name', 'slug', 'avatar', 'avatarPath'],
}
