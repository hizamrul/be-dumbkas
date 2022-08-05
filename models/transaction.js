'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    id: {
      type:DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: DataTypes.STRING,
    type: DataTypes.STRING,
    nominal: DataTypes.STRING,
    categoryId: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};