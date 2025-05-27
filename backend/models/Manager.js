const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Manager = sequelize.define('Manager', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'managers'
});

// Хешировать пароль перед созданием записи
Manager.beforeCreate(async (manager) => {
  const salt = await bcrypt.genSalt(10);
  manager.password = await bcrypt.hash(manager.password, salt);
});

// Метод сравнения пароля
Manager.prototype.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Метод получения по email
Manager.findByEmail = async function (email) {
  return await Manager.findOne({ where: { email } });
};

module.exports = Manager;