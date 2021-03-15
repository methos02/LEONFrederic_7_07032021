module.exports = (Sequelize, DataTypes) => {
    const Post = Sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type : DataTypes.STRING(256),
            allowNull: true,
            default: null
        },
        content: {
            type : DataTypes.TEXT,
            required: true,
            allowNull: false
        },
        like: {
            type: DataTypes.INTEGER,
            default: 0
        },
        dislike: {
            type: DataTypes.INTEGER,
            default: 0
        }
    }, {})

    Post.associate = function (models) {
        Post.belongsTo(models.User);
        Post.hasMany(models.Like);
        Post.hasMany(models.Comment);
    }

    return Post;
};
