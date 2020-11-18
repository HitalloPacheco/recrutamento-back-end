const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      reset_token: DataTypes.STRING,
      token_expires: DataTypes.DATE,
    }, {
      sequelize
    })
  }
}

module.exports = User;
