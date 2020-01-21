import databaseBuilder from './databaseBuilder';

const isTestEnvironment = process.env.JEST_WORKER_ID !== undefined;

const DB = isTestEnvironment
  ? databaseBuilder(
    {
      databaseName: 'LanguageLock',
      username: 'root',
      password: 'root',
      host: 'localhost',
      logging: false,
    },
  )
  : databaseBuilder(
    {
      databaseName: 'LanguageLock',
      username: 'root',
      password: 'root',
      host: 'localhost',
      logging: false,
    },
  );


export default DB;
