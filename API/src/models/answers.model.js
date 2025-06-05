const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');
const { EVENT_TABLE } = require('../models/event.model')
const { QUESTION_TABLE } = require('../models/question.model');
const { PARTICIPANT_TABLE } = require('./participants.model');

const ANSWER_TABLE = 'answers';

const Answer = sequelize.define(ANSWER_TABLE, {
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
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: QUESTION_TABLE,
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
    },
    response: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: 'Indicates if the answer is correct'
    },
    response_time: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Response time in seconds with millisecond precision'
    },
    points_awarded: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: ANSWER_TABLE,
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['event_id', 'question_id', 'participant_id'],
            name: 'unique_answer_per_participant_event_question'
        }
    ]
});

module.exports = { Answer, ANSWER_TABLE };