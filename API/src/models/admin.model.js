const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connection");
const ADMIN_TABLE = "admins";

const Admin = sequelize.define(
  ADMIN_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  },
  {
    tableName: ADMIN_TABLE,
    timestamps: true, 
  }
);

module.exports = { Admin, ADMIN_TABLE };
