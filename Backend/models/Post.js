const { postPath } = require('../helpers/imageHelper')
const { formatDate } = require('../helpers/dateHelper')

module.exports = (Sequelize, DataTypes) => {
    const Post = Sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type : DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type : DataTypes.STRING(256),
            allowNull: true
        },
        content: {
            type : DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type : DataTypes.STRING(256),
            allowNull: true,
        },
        imagePath: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.image !== null ? process.env.BASE_URL + postPath + this.image : null;
            },
        },
        like: {
            type: DataTypes.INTEGER,
            default: 0
        },
        dislike: {
            type: DataTypes.INTEGER,
            default: 0
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        formatCreatedAt: {
            type: DataTypes.VIRTUAL,
            get() {
                const date = new Date(this.createdAt);
                return formatDate(date);
            },
        }
    });

    Post.associate = function (models) {
        Post.belongsTo(models.User);
        Post.hasMany(models.Like);
        Post.hasMany(models.Comment);
    }

    return Post;
};
