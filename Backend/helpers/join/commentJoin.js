const Comment = require('../../models').Comment;
const User = require('../../models').User;
const userJoin = require('./userJoin');

module.exports = {
    model: Comment,
    include: [{...userJoin, model : User}]
}
