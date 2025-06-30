const { Sequelize } = require('sequelize');
const path = require('path');
const UserModelDef = require('./user');

// Initialize SQLite DB
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../data.sqlite'),
  logging: false,
});

const User = UserModelDef(sequelize);

const db = {
  sequelize,
  Sequelize,
  User,
};

module.exports = db;
