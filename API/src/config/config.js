const dotenv = require('dotenv'); 
dotenv.config();

const isSSL = process.env.DB_SSL_MODE === 'true';

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: isSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        connectTimeout: 100000,
      }
    : {},
};

module.exports = {
  development: baseConfig,
  production: {
    ...baseConfig,
    dialectOptions: isSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};
