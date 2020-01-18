import Sequelize from 'sequelize'
import mysqldump from 'mysqldump';
import fs from 'fs';

import {
  UserSchema,
  UserHistorySchema,
  TermSchema,
  TagSchema,
  TermTagSchema
} from '../models';

const dbName = 'LanguageLock';
const username = 'root';
const password = 'root';

const sequelize = new Sequelize(
  dbName,
  username,
  password,
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)

const Users = sequelize.define('Users', UserSchema);
const UserHistory = sequelize.define('UserHistory', UserHistorySchema);
const Terms = sequelize.define('Terms', TermSchema);
const Tags = sequelize.define('Tags', TagSchema);
const [ termTagSchema, termTagOptions ] = TermTagSchema;
const TermTags = sequelize.define('TermTags', termTagSchema, termTagOptions);


Terms.hasMany(TermTags, { foreignKey: 'termId', onDelete: 'cascade' });
Tags.hasMany(TermTags, { foreignKey: 'tagId', onDelete: 'cascade' });



sequelize
  .sync({ force: true })
  .then(async () => {

    const convertToSchema = entry => ({
      side1: entry.traditional,
      side2: entry.simplified,
      side3: entry.pinyin,
      translation: entry.translation,
    });

    const addHskGroup = async (path, name) => {
      const hskTermJson = JSON.parse(fs.readFileSync(path, 'utf-8')).map(convertToSchema);

      const newHskTag = await Tags.create({ name });
      const newTerms = await Terms.bulkCreate(hskTermJson);
      const hskTaggedTerms = newTerms.map(newTerm => ({ tagId: newHskTag.id, termId: newTerm.id }));
      await TermTags.bulkCreate(hskTaggedTerms);
    }

    await Promise.all([
      addHskGroup('data/hsk/1.json', 'hsk1'),
      addHskGroup('data/hsk/2.json', 'hsk2')
    ])


    console.log(`___________________________________________________________`)
  });

const createBackup = async () => {
  const currentISOTime = new Date().toISOString();
  const dumpToFile = `./backups/${currentISOTime}.sql.gz`;
  await mysqldump({
    connection: {
      host: 'localhost',
      user: username,
      password: password,
      database: dbName,
    },
    compressFile: true,
    dumpToFile,
  });
  return `${currentISOTime}.sql.gz`;
};

export {
  Users,
  UserHistory,
  Terms,
  Tags,
  TermTags,
  sequelize,
  createBackup
};