'use strict';
const {defaultAvatar} = require("../helpers/imageHelper");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING(256),
        unique: true,
        required: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(256),
        unique: true,
        required: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(256),
        required: true,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: defaultAvatar
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      banUntil: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      nbBan: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      messageBan: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    })
  },

  down: async (queryInterface) => {
     await queryInterface.dropTable('users');
  }
};
