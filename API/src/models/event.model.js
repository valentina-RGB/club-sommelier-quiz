const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connection");
const { QUESTIONNAIRE_TABLE } = require("../models/questionnaire.model")

const EVENT_TABLE = "events";

const Event = sequelize.define(
  EVENT_TABLE,
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
    access_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    questionnaire_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: QUESTIONNAIRE_TABLE,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'live', 'closed'),
      defaultValue: 'draft',
      allowNull: false
    }
  },
  {
    tableName: EVENT_TABLE,
    timestamps: true,
  }
);

module.exports = { Event, EVENT_TABLE }
