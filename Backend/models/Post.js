const { postPath } = require('../helpers/imageHelper')
const { formatDate } = require('../helpers/dateHelper')
const SequelizeSlugify = require('sequelize-slugify');

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
        slug: {
            type: DataTypes.STRING(256),
            unique: true,
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
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislikes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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

    SequelizeSlugify.slugifyModel(Post, {
        source: ['title'],
        overwrite: false,
    });

    Post.associate = function (models) {
        Post.belongsTo(models.User);
        Post.hasMany(models.Like);
        Post.hasMany(models.Comment);
    }

    return Post;
};
