import Sequelize from 'sequelize';

const SegmentSchema = [
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sessionId: {
      type: Sequelize.INTEGER,
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    side1: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    side2: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    side3: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    correct: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    unknown: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    wrong: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    validate: {
      validSegment() {
        const hasValidSideQuery = [this.side1, this.side2, this.side3]
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
