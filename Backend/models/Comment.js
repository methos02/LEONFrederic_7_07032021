const { formatDate } = require('../helpers/dateHelper')

module.exports = (Sequelize, DataTypes) => {
    const Comment = Sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type : DataTypes.TEXT,
            required: true,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ParentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        RefId: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
        formatCreatedAt: {
            type: DataTypes.VIRTUAL,
            get() {
                const date = new Date(this.createdAt);
                return formatDate(date);
            },
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {})

    Comment.associate = function (models) {
        Comment.belongsTo(models.User);
        Comment.belongsTo(models.Comment, { through: Comment, as: "Parent", foreignKey: "ParentId" });
    }

    return Comment;
};
