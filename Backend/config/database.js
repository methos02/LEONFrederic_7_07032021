const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');
/**
 * Initialisation de la connection à la base de donnée
 */
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USERNAME,
    process.env.NODE_ENV ? process.env.MYSQL_ROOT_PASSWORD : null,
    {
        dialect: 'mysql',
        host: process.env.NODE_ENV ? process.env.MYSQL_HOST :'127.0.0.1',
        port: process.env.MYSQL_LOCAL_PORT,
    })
;

const db = {};
const models = path.join(__dirname, '../models/'); // path to a models' folder

fs.readdirSync(models)
    .filter(function (file) {
        return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
    })
    .forEach(function (file) {
        const model = require(path.join(models, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// This creates the table if it doesn't exist (and does nothing if it already exists)
sequelize
    .sync()
    .then((_result) => {
        console.log('Sequelize: All models were synchronized successfully.');
    })
    .catch((err) => {
        console.log(err);
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
