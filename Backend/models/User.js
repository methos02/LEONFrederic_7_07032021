'use strict';
const {formatDate} = require("../helpers/dateHelper");
const { avatarPath } = require('../helpers/imageHelper');
const SequelizeSlugify = require('sequelize-slugify');

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
        firstname: {
            type: DataTypes.STRING(256),
            required: true,
            allowNull: false,
            set: function(val) {
                return this.setDataValue('firstname', val[0].toUpperCase() + val.substring(1));

            }
        },
        lastname: {
            type: DataTypes.STRING(256),
            required: true,
            allowNull: false,
            set: function(val) {
                return this.setDataValue('lastname', val.toUpperCase());
            }
        },
        name: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.lastname + ' ' + this.firstname;
            },
        },
        slug: {
            type: DataTypes.STRING(256),
            unique: true
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
                return process.env.BASE_URL + avatarPath + this.avatar;
            },
        },
        roles : {
            type: DataTypes.STRING(256),
            get: function() {
                if(this.getDataValue('roles') === null) {
                    return [];
                }

                if(this.getDataValue('roles') !== undefined) {
                    return JSON.parse(this.getDataValue('roles'));
                }
            },
            set: function(val) {
                if(val.length === 0) {
                    return this.setDataValue('roles', null);
                }

                return this.setDataValue('roles', JSON.stringify(val));
            }
        },
        banUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        formatBanUntil: {
            type: DataTypes.VIRTUAL,
            get() {
                if(this.banUntil !== null) {
                    const date = new Date(this.banUntil);
                    return formatDate(date);
                }

                return null;
            },
        },
        nbBan: {
            type: DataTypes.INTEGER,
            default: 0
        },
        messageBan: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        supp : {
            type: DataTypes.INTEGER,
            default: 0
        }
    });

    SequelizeSlugify.slugifyModel(User, {
        source: ['lastname', 'firstname'],
        overwrite: false,
    });

    User.associate = function (models) {
        User.hasMany(models.Post);
        User.hasMany(models.Comment);
        User.hasMany(models.Like);
    }

    User.prototype.hasRole = function(name) {
        return this.roles.find( (role) => role === name );
    }

    return User;
};
