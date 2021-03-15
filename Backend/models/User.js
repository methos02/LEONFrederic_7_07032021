'use strict';

module.exports = (Sequelize, DataTypes) => {
    const User = Sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(256),
            required: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(256),
            required: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(256),
            required: true,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING(256),
            default: null,
            allowNull: true
        },
        isAdmin : {
            type: DataTypes.INTEGER,
            default: 0
        }
    }, {});

    User.associate = function (models) {
        User.hasMany(models.Post);
        User.hasMany(models.Comment);
        User.hasMany(models.Like);
    }

    return User;
};
