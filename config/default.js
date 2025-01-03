import packageJson from '../package.json' assert { type: 'json' };

export default {
  application: {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  },
  templates: {
    path: './templates',
    suffix: '.ejs',
    coding: 'utf-8',
  },
  languages: {
    defaultLangCode: process.env.GACHA_SIMULATOR_REST_DEFAULT_LANGUAGE_CODE || 'en',
  },
  server: {
    port: process.env.GACHA_SIMULATOR_REST_PORT,
    apiKey: process.env.GACHA_SIMULATOR_REST_API_KEY,
  },
  sentry: {
    dsn: process.env.SENTRY_GENSHIN_GACHA_SIMULATOR_REST_API_DSN,
  },
  bcrypt: {
    salt: 'say_my_name',
    saltRounds: 10,
  },
  session: {
    key: 'gacha-simulator-rest',
    maxAge: 1000 * 60 * 60 * 24 * 31, // 1 month
    signed: true,
  },
  analytics: {
    Amplitude: {
      key: process.env.AMPLITUDE_GACHA_SIMULATOR_REST_API_KEY,
    },
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
    mongodbStatic: {
      url: process.env.MONGODB_1_HOSTNAME,
      options: {
        dbName: 'genshinImpactStaticData',
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
        authSource: 'admin',
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      },
    },
    redis: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOSTNAME,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  },
  rest: {
    artur: {
      host: process.env.ARTURPETROV_HOST,
      protocol: process.env.ARTURPETROV_PROTOCOL,
    },
  },
};
