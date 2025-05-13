require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.PG_USER,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DATABASE,
    "port": process.env.PG_PORT,
    "host": process.env.PG_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.PG_USER,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DATABASE,
    "port": process.env.PG_PORT,
    "host": process.env.PG_HOST,
    "dialect": "postgres"
  }
}
