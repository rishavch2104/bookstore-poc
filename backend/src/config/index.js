import 'dotenv/config';

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  db: {
    uri:
      process.env.DATABASE_URL ||
      'postgres://myuser:mypassword@localhost:5432/mydatabase',
    logging: process.env.DB_LOGGING === 'true',
    mongouri: process.env.MONGODB_URI || 'mongodb://localhost:27017/booksdb',
  },
};
