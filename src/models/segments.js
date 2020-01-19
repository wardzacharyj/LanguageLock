import Sequelize from 'sequelize';

const SegmentSchema = [
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    batchId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    usedSide1: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    usedSide2: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    usedSide3: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    correct: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    unknown: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    wrong: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    validate: {
      validSegment() {
        const hasValidSideQuery = [this.usedSide1, this.usedSide2, this.usedSide3]
          .filter((value) => !!value).length <= 1;

        if (!hasValidSideQuery) {
          throw new Error('Invalid Side Guess, only one side value for the segment can be set');
        }
        const hasValidGuess = [this.correct, this.unknown, this.wrong]
          .filter((value) => !!value).length <= 1;

        if (!hasValidGuess) {
          throw new Error('Invalid Side Guess, only one side value for the segment can be set');
        }
      },
    },
  },
];

export default SegmentSchema;
