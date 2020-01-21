import Sequelize from 'sequelize';
import mysqldump from 'mysqldump';
import fs from 'fs';

import {
  UserSchema,
  UserHistorySchema,
  TermSchema,
  TagSchema,
  TermTagSchema,
  SegmentSchema,
} from '../models';


const databaseBuilder = (
  {
    databaseName,
    username,
    password,
    host,
    logging,
  },
) => {
  const db = new Sequelize(
    databaseName,
    username,
    password,
    {
      host: host || 'localhost',
      dialect: 'mysql',
      logging: !!logging,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  );

  const Users = db.define('Users', UserSchema);
  const UserHistory = db.define('UserHistory', UserHistorySchema);
  const Terms = db.define('Terms', TermSchema);
  const Tags = db.define('Tags', TagSchema);

  const [termTagSchema, termTagOptions] = TermTagSchema;
  const TermTags = db.define('TermTags', termTagSchema, termTagOptions);

  const [segmentSchema, segmentOptions] = SegmentSchema;
  const Segments = db.define('Segments', segmentSchema, segmentOptions);

  Terms.hasMany(Segments, { foreignKey: 'termId', onDelete: 'cascade' });
  Terms.hasMany(TermTags, { foreignKey: 'termId', onDelete: 'cascade' });
  Tags.hasMany(TermTags, { foreignKey: 'tagId', onDelete: 'cascade' });

  const createBackup = async () => {
    const currentISOTime = new Date().toISOString();
    const dumpToFile = `./backups/${currentISOTime}.sql.gz`;
    await mysqldump({
      connection: {
        host: host || 'localhost',
        user: username,
        password,
        database: databaseName,
      },
      compressFile: true,
      dumpToFile,
    });
    return `${currentISOTime}.sql.gz`;
  };

  const convertToSchema = (entry) => ({
    side1: entry.traditional,
    side2: entry.simplified,
    side3: entry.pinyin,
    translation: entry.translation,
  });

  const addHskGroup = async (path, name) => {
    const hskTermJson = JSON.parse(fs.readFileSync(path, 'utf-8')).map(convertToSchema);
    const newHskTag = await Tags.create({ name });
    const newTerms = await Terms.bulkCreate(hskTermJson);
    const hskTaggedTerms = newTerms.map((newTerm) => ({
      tagId:
    newHskTag.id,
      termId: newTerm.id,
    }));
    await TermTags.bulkCreate(hskTaggedTerms);
  };

  const loadData = async () => Promise.all([
    addHskGroup('data/hsk/1.json', 'hsk1'),
    addHskGroup('data/hsk/2.json', 'hsk2'),
  ]);

  db.sync({ force: true }).then(loadData);

  return {
    root: db,
    createBackup,
    Users,
    UserHistory,
    Terms,
    Tags,
    TermTags,
    Segments,
    reset: () => db.sync({ force: true }).then(loadData),
  };
};

export default databaseBuilder;
