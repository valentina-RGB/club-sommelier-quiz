const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connection");

const LEVEL_TABLE = "levels";

const Level = sequelize.define(
  LEVEL_TABLE,
  {
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
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: LEVEL_TABLE,
    timestamps: true,
  }
);

module.exports = { Level, LEVEL_TABLE };
