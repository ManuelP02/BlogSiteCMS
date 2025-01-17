const Sequelize = require('sequelize');

require('dotenv').config();

let sequelize

if (process.env.DB_URL) {
    sequelize = new Sequelize(process.env.DB_URL);
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: 'localhost',
        dialect: 'postgres',
        dialectOptions:{
          charset: 'utf8mb4'
        }, 
        define:{
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
        },
      }
    );
  }
  
  module.exports = sequelize;