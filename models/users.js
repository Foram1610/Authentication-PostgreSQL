'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    expireToken: DataTypes.DATE,
    userRole: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: (user) => {
        {
          user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
        }
      },
      beforeUpdate: (user) => {
        {
          user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
        }
      }
    },
    sequelize,
    modelName: 'Users',
  });
  return Users;
};