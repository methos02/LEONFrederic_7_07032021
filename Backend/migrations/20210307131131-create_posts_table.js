'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type : Sequelize.STRING(256),
        allowNull: true,
        defaultValue: null
      },
      content: {
        type : Sequelize.TEXT,
        required: true,
        allowNull: false
      },
      like: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      dislike: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('posts');
  }
};
