'use strict';

const { QUESTION_TABLE } = require('../../models/question.model');
const { QUESTION_CATEGORY_TABLE } = require('../../models/question-category.model');
const { CATEGORIE_TABLE } = require('../../models/categories.model');
const SeederHelper = require('../helper/seeder.helper');
const RelationSeederHelper = require('../helper/question-seeder.helper');

const questionsData = require('../data/questions.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Paso 1: Sembrar las preguntas básicas
      const questions = questionsData.map(q => ({
        question: q.question,
        response: q.response,
        level_id: q.level_id
      }));
      
      await SeederHelper.seedData(queryInterface, QUESTION_TABLE, questions, 'question');
      
      // Paso 2: Establecer las relaciones con categorías
      await RelationSeederHelper.seedRelations(
        queryInterface,
        QUESTION_TABLE,          // Tabla fuente
        CATEGORIE_TABLE,         // Tabla objetivo
        QUESTION_CATEGORY_TABLE, // Tabla intermedia
        questionsData,           // Datos con relaciones
        'question',              // Campo a buscar en questions
        'name',                  // Campo a buscar en categories
        'question_id',           // FK en tabla intermedia
        'category_id',           // FK en tabla intermedia
        'categories'             // Propiedad que contiene categorías en el JSON
      );
      
      console.log('✅ Preguntas y sus relaciones sembradas correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error sembrando preguntas:', error);
      return false;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Primero eliminar las relaciones
      await queryInterface.bulkDelete(QUESTION_CATEGORY_TABLE, null, {});
      console.log('✅ Relaciones de preguntas eliminadas');
      
      // Luego eliminar las preguntas
      const questions = questionsData.map(q => q.question);
      await queryInterface.bulkDelete(QUESTION_TABLE, {
        question: { [Sequelize.Op.in]: questions }
      }, {});
      console.log('✅ Preguntas eliminadas');
    } catch (error) {
      console.error('❌ Error eliminando preguntas:', error);
    }
  }
};