import Sequelize from 'sequelize';


const TermSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lastStudied: Sequelize.DATE,
  side1: Sequelize.STRING,
  side2: Sequelize.STRING,
  side3: Sequelize.STRING,
  translation: Sequelize.STRING,
  partOfSpeech: Sequelize.STRING,
  notes: Sequelize.STRING,
  occurencesStudied: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  durationStudied: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side1_correct: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side2_correct: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side3_correct: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side1_unknown: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side2_unknown: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side3_unknown: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side1_incorrect: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side2_incorrect: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  side3_incorrect: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 0,
  },

};

export default TermSchema;