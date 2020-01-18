import Sequelize from 'sequelize';

const UserHistorySchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  timeOfLogin: {
    type: Sequelize.DATE,
  },
};


export default UserHistorySchema;
