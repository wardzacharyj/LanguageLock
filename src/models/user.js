import Sequelize from 'sequelize';

const UserSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lastLogin: Sequelize.DATE,
  email: Sequelize.STRING,
  hash: Sequelize.STRING,
};

export default UserSchema;
