'use strict';

/**
 * Helper class for seeders with best practices
 */
class SeederHelper {
  /**
   * Safely seeds data by checking for existing records first
   * @param {Object} queryInterface - Sequelize query interface
   * @param {String} tableName - Name of table to seed
   * @param {Array} data - Array of objects to insert
   * @param {String} uniqueField - Field to check for uniqueness
   * @param {Boolean} updateExisting - Whether to update existing entries
   * @returns {Promise<Boolean>} Success status
   */
  static async seedData(queryInterface, tableName, data, uniqueField = 'name', updateExisting = false) {
    try {
      console.log(`Seeding ${tableName}...`);
      let created = 0;
      let skipped = 0;
      let updated = 0;

      for (const item of data) {
        const whereClause = { [uniqueField]: item[uniqueField] };
        
        const existingItem = await queryInterface.rawSelect(tableName, {
          where: whereClause
        }, ['id']);

        const itemToInsert = {
          ...item,
          createdAt: item.createdAt || new Date(),
          updatedAt: new Date()
        };

        if (!existingItem) {
          await queryInterface.bulkInsert(tableName, [itemToInsert]);
          created++;
        } else if (updateExisting) {
          await queryInterface.bulkUpdate(tableName, itemToInsert, whereClause);
          updated++;
        } else {
          skipped++;
        }
      }

      console.log(`✅ ${tableName} seeding complete: ${created} created, ${skipped} skipped, ${updated} updated`);
      return true;
    } catch (error) {
      console.error(`❌ Error seeding ${tableName}:`, error);
      throw error; 
    }
  }
}

module.exports = SeederHelper;