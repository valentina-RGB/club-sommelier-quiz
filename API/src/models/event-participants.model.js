const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');
const { PARTICIPANT_TABLE } = require('./participants.model');
const { EVENT_TABLE } = require('./event.model');

const EVENT_PARTICIPANTS_TABLE = 'event_participants';

const EventParticipant = sequelize.define(EVENT_PARTICIPANTS_TABLE, {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EVENT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PARTICIPANT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  }
}, {
  tableName: EVENT_PARTICIPANTS_TABLE,
  timestamps: false
});

module.exports = { EventParticipant, EVENT_PARTICIPANTS_TABLE };