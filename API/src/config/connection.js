const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`\n✅ [${env.toUpperCase()}] Connection established to the "${ process.env.DB_NAME}" database on port ${ process.env.DB_PORT}.`);
  } catch (error) {
    console.error(`❌ [${env.toUpperCase()}] Error connecting to the database:`, error.message);
    throw error;
  }
  return sequelize;
};

module.exports = { sequelize, connectToDatabase };
