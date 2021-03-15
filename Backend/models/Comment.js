const Sequelize = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Comment = Sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type : DataTypes.TEXT,
            required: true,
            allowNull: false
        },
        nb_answer: {
            type: DataTypes.INTEGER,
            default: 0
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {})

    Comment.associate = function (models) {
        Comment.belongsTo(models.User)
    }

    return Comment;
};
