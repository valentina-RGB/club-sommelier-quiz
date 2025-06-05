const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const CATEGORIE_TABLE = 'categories';

const Category = sequelize.define(CATEGORIE_TABLE, {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: CATEGORIE_TABLE,
  timestamps: true
});

module.exports = { Category, CATEGORIE_TABLE };