'use strict';

const { LEVEL_TABLE } = require('../../models/level.model');
const SeederHelper = require('../helper/seeder.helper');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const levels = [
      {
        name: 'Nivel 1',
        points: 100,
        description: 'Especialistas en gastronomía y estudiantes'
      },
      {
        name: 'Nivel 2',
        points: 200,
        description: 'Entendidos en la materia, pero no gastrónomos'
      },
      {
        name: 'Nivel 3',
        points: 300,
        description: 'Pregunta para personas con conocimiento avanzado'
      }
    ];

    return SeederHelper.seedData(queryInterface, LEVEL_TABLE, levels, 'name');
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete(LEVEL_TABLE, {
        name: { [Sequelize.Op.in]: ['Nivel 1', 'Nivel 2', 'Nivel 3'] }
      }, {});
    } catch (error) {
      console.error('Error removing levels:', error);
    }
  }
};