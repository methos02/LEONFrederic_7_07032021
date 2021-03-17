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
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        AnswerId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ParentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        RefId: {
            type: DataTypes.INTEGER
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
        Comment.belongsTo(models.User);
        Comment.belongsTo(models.Comment, { through: Comment, as: "Answer", foreignKey: "AnswerId" });
        Comment.belongsTo(models.Comment, { through: Comment, as: "Parent", foreignKey: "ParentId" });
    }

    return Comment;
};
