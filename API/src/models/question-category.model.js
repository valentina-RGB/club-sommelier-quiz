const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connection");
const { QUESTION_TABLE } = require("../models/question.model");
const { CATEGORY_TABLE } = require("../models/categories.model");

const QUESTION_CATEGORY_TABLE = "question_categories";

const QuestionCategory = sequelize.define(
  QUESTION_CATEGORY_TABLE,
  {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: QUESTION_TABLE,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: CATEGORY_TABLE,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: QUESTION_CATEGORY_TABLE,
    timestamps: false,
  }
);

module.exports = { QuestionCategory, QUESTION_CATEGORY_TABLE };
