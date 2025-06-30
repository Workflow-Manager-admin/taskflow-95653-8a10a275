const { Sequelize } = require('sequelize');
const path = require('path');
const UserModelDef = require('./user');
const TaskModelDef = require('./task');

// Initialize SQLite DB
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../data.sqlite'),
  logging: false,
});

const User = UserModelDef(sequelize);
const Task = TaskModelDef(sequelize);

// Associations
User.hasMany(Task, {
  foreignKey: 'user_id',
  as: 'tasks',
  onDelete: 'CASCADE',
});
Task.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

const db = {
  sequelize,
  Sequelize,
  User,
  Task,
};

module.exports = db;
