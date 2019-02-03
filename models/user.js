'use strict';
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    hash: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    models.User.hasMany(models.Score);
  };
  User.prototype.generateAuthToken = function() {
    return jwt.sign({subject: this.id,
                      username: this.username,
                      email: this.email,
                      isAdmin: this.isAdmin
    }, config.get('SECRET_KEY'), { expiresIn: '7d' });
  };
  User.generateHash = function(rawPassword) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(rawPassword, salt);
  };
  return User;
};