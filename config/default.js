const packageJson = require('../package.json');

module.exports = {
  application: {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  },
  languages: {
    defaultLangCode: process.env.DEFAULT_LANGUAGE_CODE || 'en',
  },
  server: {
    port: process.env.GACHA_SIMULATOR_REST_PORT,
  },
  db: {
    mongodb: {
      url: process.env.MONGODB_1_HOSTNAME,
      options: {
        dbName: 'genshinImpactTgBot',
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
        authSource: 'admin',
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      },
    },
  },
};
