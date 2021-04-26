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
      UserId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      PostId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'posts',
          key: 'id'
        }
      },
      ParentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
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
    await queryInterface.removeColumn( 'comments', 'UserId' );
    await queryInterface.removeColumn( 'comments', 'PostId' );
    await queryInterface.removeColumn( 'comments', 'ParentId' );
    await queryInterface.dropTable('comments');
  }
};
