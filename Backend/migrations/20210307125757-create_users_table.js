'use strict';

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
        required: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(256),
        required: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(256),
        required: true,
        allowNull: false
      },
      avatar: {
        type: Sequelize.INTEGER,
        allowNull: true
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
      }
    })
  },

  down: async (queryInterface) => {
     await queryInterface.dropTable('users');
  }
};
