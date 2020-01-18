import Sequelize from 'sequelize';


const TagSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
};

const TermTagSchema = [
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    uniqueKeys: {
      unique_tag_term: {
        fields: ['tagId', 'termId'],
        customIndex: true,
      },
    },
  },
];

export {
  TagSchema,
  TermTagSchema,
};
