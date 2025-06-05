const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');
const { CATEGORIE_TABLE } = require('./categories.model');
const { QUESTIONNAIRE_TABLE } = require('./questionnaire.model');

const QUESTIONNAIRE_CATEGORIES_TABLE = 'questionnaire_categories';

const QuestionnaireCategory = sequelize.define(
  QUESTIONNAIRE_CATEGORIES_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionnaire_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: QUESTIONNAIRE_TABLE,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CATEGORIE_TABLE,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: QUESTIONNAIRE_CATEGORIES_TABLE,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['questionnaire_id', 'category_id'],
      },
    ],
  }
);

module.exports = {
  QuestionnaireCategory,
  QUESTIONNAIRE_CATEGORIES_TABLE,
};
