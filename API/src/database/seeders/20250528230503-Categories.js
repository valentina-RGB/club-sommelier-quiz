'use strict';

const { CATEGORIE_TABLE } = require('../../models/categories.model');
const SeederHelper = require('../helper/seeder.helper');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: 'CARNES',
        description: 'Preguntas sobre tipos de carnes, orígenes y preparación.'
      },
      {
        name: 'SENSORIAL',
        description: 'Preguntas sobre sensaciones relacionadas a la comida.'
      }
    ];

    // Usamos el helper para sembrar datos de forma segura
    return SeederHelper.seedData(queryInterface, CATEGORIE_TABLE, categories, 'name');
  },

  async down(queryInterface, Sequelize) {
    try {
      // Eliminamos sólo las categorías específicas que insertamos
      await queryInterface.bulkDelete(CATEGORIE_TABLE, {
        name: { [Sequelize.Op.in]: ['CARNES', 'Sensorial'] }
      }, {});
    } catch (error) {
      console.error('Error removing categories:', error);
    }
  }
};