const User = require('../../models').User;

module.exports = {
    model: User,
    attributes: ['id', 'firstname', 'lastname', 'name', 'slug', 'avatar', 'avatarPath'],
}
