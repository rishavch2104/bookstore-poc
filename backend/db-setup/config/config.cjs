require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'PG_DATABASE_URL',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'PG_DATABASE_URL',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'PG_DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // needed for Render/Heroku
      },
    },
  },
};
