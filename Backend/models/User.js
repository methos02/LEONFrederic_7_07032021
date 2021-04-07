'use strict';
const { avatarPath, defaultAvatar } = require('../helpers/imageHelper')

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
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING(256),
            default: null,
        },
        avatarPath: {
            type: DataTypes.VIRTUAL,
            get() {
                return process.env.BASE_URL + avatarPath + (this.avatar !== null ? this.avatar : defaultAvatar);
            },
        },
        isAdmin : {
            type: DataTypes.INTEGER,
            default: 0
        },
        banUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        nbBan: {
            type: DataTypes.INTEGER,
            default: 0
        },
        messageBan: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Post);
        User.hasMany(models.Comment);
        User.hasMany(models.Like);
    }

    return User;
};
