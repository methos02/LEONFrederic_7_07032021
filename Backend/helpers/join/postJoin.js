const Comment = require('../../models').Comment;
const User = require('../../models').User;
const Post = require('../../models').Post;
const commentJoin = require('./commentJoin');
const userJoin = require('./userJoin');

module.exports = {
    model: Post,
    include: [{...commentJoin, model : Comment}, {...userJoin, model : User}]
}
