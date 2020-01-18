import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

const inputDate = filename => new Date(filename.substring(0, filename.indexOf('.')));

const Backup = new GraphQLObjectType({
  name: 'Backup',
  fields: () => ({
    downloadUrl: {
      type: GraphQLString,
      resolve({ filename }) {
        return `localhost:3000/backups/${encodeURIComponent(filename)}`;
      }
    },
    year: {
      type: GraphQLInt,
      resolve({ filename }) {
        return inputDate(filename).getFullYear();
      }
    },
    month: {
      type: GraphQLInt,
      resolve({ filename }) {
        return inputDate(filename).getMonth();
      }
    },
    day: {
      type: GraphQLInt,
      resolve({ filename }) {
        return inputDate(filename).getDay();
      }
    },
    hour: {
      type: GraphQLInt,
      resolve({ filename }) {
        return inputDate(filename).getHours();
      }
    },
    minute: {
      type: GraphQLInt,
      resolve({ filename }) {
        return inputDate(filename).getMinutes();
      }
    }
  })
});

export default Backup;