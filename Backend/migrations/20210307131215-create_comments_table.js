'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      content: {
        type : Sequelize.TEXT,
        required: true,
        allowNull: false
      },
      nb_answer: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      PostId: {
        type: Sequelize.INTEGER
      },
      AnswerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'comments',
          key: 'id'
        }
      },
      ParentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id'
        }
      },
      RefId: {
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
    }).then(() => queryInterface.addIndex('comments', ['PostId', 'RefId', 'id'], { name : 'ind_comment'}))
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('comments');
  }
};
