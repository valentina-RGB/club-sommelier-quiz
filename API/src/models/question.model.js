const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connection");
const { LEVEL_TABLE } = require("../models/level.model");

const QUESTION_TABLE = "questions";

const Question = sequelize.define(
  QUESTION_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    response: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LEVEL_TABLE,
        key: "id",
      },
      onDelete: "RESTRICT",
    },
  },
  {
    tableName: QUESTION_TABLE,
    timestamps: true,
  }
);

module.exports = { Question, QUESTION_TABLE };
