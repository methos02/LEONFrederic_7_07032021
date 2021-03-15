const Sequelize = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Like = Sequelize.define('Like', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        like: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {})

    Like.associate = function (models) {
        Like.belongsTo(models.User);
        Like.belongsTo(models.Post);
    }

    return Like;
};
