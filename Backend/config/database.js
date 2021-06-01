const { Sequelize } = require('sequelize');
/**
 * Initialisation de la connection à la base de donnée
 */
const config = require('./config.json')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config);

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(e => console.error('Unable to connect to the database:', e));

module.exports = { sequelize }
