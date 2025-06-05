'use strict';

/**
 * Helper para manejar relaciones en tablas intermedias
 */
class RelationSeederHelper {
  /**
   * Establece relaciones entre elementos en una tabla intermedia
   */
  static async seedRelations(
    queryInterface, 
    sourceTable, 
    targetTable, 
    relationTable, 
    items, 
    sourceField,
    targetField,
    sourceKey,
    targetKey,
    relationsKey
  ) {
    let relationsCreated = 0;
    let relationsSkipped = 0;
    
    for (const item of items) {
      try {
        const sourceItem = await queryInterface.rawSelect(sourceTable, {
          where: { [sourceField]: item[sourceField] },
        }, ['id']);
        
        if (!sourceItem) {
          continue;
        }
        
        if (item[relationsKey] && Array.isArray(item[relationsKey])) {
          for (const targetValue of item[relationsKey]) {
            const targetItem = await queryInterface.rawSelect(targetTable, {
              where: { [targetField]: targetValue },
            }, ['id']);
            
            if (!targetItem) {
              continue;
            }
            
            const existingRelation = await queryInterface.rawSelect(relationTable, {
              where: {
                [sourceKey]: sourceItem,
                [targetKey]: targetItem
              }
            }, ['id']);
            
            if (!existingRelation) {
              try {
                await queryInterface.bulkInsert(relationTable, [{
                  [sourceKey]: sourceItem,
                  [targetKey]: targetItem,
                }]);
                relationsCreated++;
              } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                  relationsSkipped++;
                } else {
                  throw error;
                }
              }
            } else {
              relationsSkipped++;
            }
          }
        }
      } catch (error) {
        console.error(`Error procesando relación para ${item[sourceField]}:`, error.message);
      }
    }
    
    console.log(`✅ Relaciones procesadas: ${relationsCreated} creadas, ${relationsSkipped} omitidas`);
  }
}

module.exports = RelationSeederHelper;