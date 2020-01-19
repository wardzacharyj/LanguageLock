import Sequelize from 'sequelize';


const TermSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  side1: Sequelize.STRING,
  side2: Sequelize.STRING,
  side3: Sequelize.STRING,
  translation: Sequelize.STRING,
  partOfSpeech: Sequelize.STRING,
  notes: Sequelize.STRING,
};


export default TermSchema;
