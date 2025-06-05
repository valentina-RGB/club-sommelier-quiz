'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();
const { ADMIN_TABLE } = require('../../models/admin.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const adminEmail = process.env.EMAIL;
      const adminPassword = process.env.PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        console.log('Admin email or password not provided in environment variables');
        return;
      }

      const existingAdmin = await queryInterface.rawSelect(ADMIN_TABLE, {
        where: {
          email: adminEmail
        },
      }, ['id']);

      if (!existingAdmin) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
        
        await queryInterface.bulkInsert(ADMIN_TABLE, [{
          email: adminEmail,
          password: hashedPassword,
          name: 'Default Admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
        
        console.log(`Admin user created with email: ${adminEmail}`);
      } else {
        console.log(`Admin with email ${adminEmail} already exists. Skipping creation.`);
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const adminEmail = process.env.EMAIL;
      if (adminEmail) {
        await queryInterface.bulkDelete('Admins', { email: adminEmail });
      }
    } catch (error) {
      console.error('Error removing admin user:', error);
    }
  }
};
