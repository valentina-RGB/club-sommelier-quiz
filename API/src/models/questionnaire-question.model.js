const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connection");
const { QUESTIONNAIRE_TABLE } = require("../models/questionnaire.model");
const { QUESTION_TABLE } = require("../models/question.model");

const QUESTIONNAIRE_QUESTION_TABLE = "questionnaire_questions";

const QuestionnaireQuestion = sequelize.define(
  QUESTIONNAIRE_QUESTION_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionnaire_id: {
      type: DataTypes.INTEGER,
      references: {
        model: QUESTIONNAIRE_TABLE,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: QUESTION_TABLE,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    tableName: QUESTIONNAIRE_QUESTION_TABLE,
    timestamps: false,
  }
);

module.exports = { QuestionnaireQuestion, QUESTIONNAIRE_QUESTION_TABLE };
