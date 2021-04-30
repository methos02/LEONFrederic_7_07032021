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
      type: {
        type : Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type : Sequelize.STRING(256),
        defaultValue: null
      },
      slug: {
        type: Sequelize.STRING(256),
        unique: true,
        allowNull: true
      },
      content: {
        type : Sequelize.TEXT,
        defaultValue: null
      },
      image: {
        type : Sequelize.STRING(256),
        defaultValue: null
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      dislikes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      UserId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    }).then(() => queryInterface.addIndex('posts', ['type'], { name : 'ind_type'}))
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn( 'posts', 'UserId' );
    await queryInterface.dropTable('posts');
  }
};
